<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Enums\PaymentStatus;
use App\Enums\WebhookEventStatus;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\WebhookEvent;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WebhookService
{
    public function handleEfichePayWebhook(array $payload): void
    {
        $eventId = $payload['eventId'] ?? null;
        if (! $eventId) {
            Log::warning('Webhook payload missing eventId', ['payload' => $payload]);

            return;
        }

        // Atomic Idempotency: firstOrCreate uses unique constraint under the hood if it fails, but better to use upsert or handle unique constraint violation.
        // Actually, firstOrCreate is good, but if two threads do it exactly at the same time, one gets a unique constraint violation.
        // Let's handle it safely.
        try {
            $event = WebhookEvent::firstOrCreate(
                ['event_id' => $eventId],
                [
                    'event_type' => $payload['status'] ?? 'UNKNOWN',
                    'payload' => $payload,
                    'status' => WebhookEventStatus::Received,
                ]
            );

            // If it wasn't recently created, it's a duplicate.
            if (! $event->wasRecentlyCreated) {
                Log::info('Duplicate webhook event received', ['event_id' => $eventId]);

                return;
            }
        } catch (UniqueConstraintViolationException $e) {
            // Another thread already inserted it.
            Log::info('Duplicate webhook event received (caught unique constraint)', ['event_id' => $eventId]);

            return;
        }

        if (($payload['status'] ?? '') !== 'PAYMENT_COMPLETE') {
            $event->update(['status' => WebhookEventStatus::Processed]);

            return;
        }

        $transactionRef = $payload['orderNumber'] ?? null;
        $amountReceived = ($payload['amount'] ?? 0) / 100; // Assuming payload amount is in cents or smallest unit

        if (! $transactionRef) {
            $event->update([
                'status' => WebhookEventStatus::Failed,
                'error_message' => 'Missing orderNumber (transaction_ref)',
            ]);

            return;
        }

        DB::transaction(function () use ($transactionRef, $event) {
            // Find the pending payment by transaction_ref
            // Notice: The webhook sends 'orderNumber' which might correspond to the Payment's transaction_ref or Invoice's transaction_ref.
            // Let's assume it corresponds to the Payment's transaction_ref.
            $payment = Payment::where('transaction_ref', $transactionRef)->lockForUpdate()->first();

            if (! $payment) {
                $event->update([
                    'status' => WebhookEventStatus::Failed,
                    'error_message' => "Payment with transaction_ref {$transactionRef} not found.",
                ]);

                return;
            }

            if ($payment->status === PaymentStatus::Confirmed) {
                // Already confirmed
                $event->update(['status' => WebhookEventStatus::Processed]);

                return;
            }

            $payment->update([
                'status' => PaymentStatus::Confirmed,
                'confirmed_at' => now(),
            ]);

            // Update invoice status
            $invoice = Invoice::where('id', $payment->invoice_id)->lockForUpdate()->first();
            if ($invoice) {
                $remaining = (float) $invoice->patient_amount - (float) $invoice->payments()->where('status', PaymentStatus::Confirmed)->sum('amount');
                if ($remaining <= 0) {
                    $invoice->update(['status' => InvoiceStatus::Paid]);
                } else {
                    $invoice->update(['status' => InvoiceStatus::PartiallyPaid]);
                }
            }

            $event->update([
                'status' => WebhookEventStatus::Processed,
                'processed_at' => now(),
            ]);
        });
    }
}
