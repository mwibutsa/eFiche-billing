<?php

namespace App\Services;

use App\DTOs\PaymentData;
use App\Enums\InvoiceStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Exceptions\InsufficientBalanceException;
use App\Exceptions\InvoiceAlreadyPaidException;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    /**
     * @throws InsufficientBalanceException
     * @throws InvoiceAlreadyPaidException
     */
    public function processPayment(Invoice $invoice, PaymentData $data): Payment
    {
        if ($data->method === PaymentMethod::MobileMoney) {
            return $this->initiateMobileMoneyPayment($invoice, $data);
        }

        return DB::transaction(function () use ($invoice, $data) {
            // Pessimistic locking: SELECT ... FOR UPDATE
            $lockedInvoice = Invoice::where('id', $invoice->id)->lockForUpdate()->firstOrFail();

            if ($lockedInvoice->is_fully_paid) {
                throw new InvoiceAlreadyPaidException();
            }

            if ($data->amount > $lockedInvoice->remaining_balance) {
                throw new InsufficientBalanceException();
            }

            $payment = Payment::create([
                'invoice_id' => $lockedInvoice->id,
                'amount' => $data->amount,
                'method' => $data->method,
                'status' => PaymentStatus::Confirmed,
                'cashier_id' => $data->cashierId,
                'confirmed_at' => now(),
            ]);

            // Re-check remaining balance after this payment
            $remaining = (float) $lockedInvoice->patient_amount - (float) $lockedInvoice->payments()->where('status', PaymentStatus::Confirmed)->sum('amount');
            
            if ($remaining <= 0) {
                $lockedInvoice->update(['status' => InvoiceStatus::Paid]);
            } else {
                $lockedInvoice->update(['status' => InvoiceStatus::PartiallyPaid]);
            }

            return $payment;
        });
    }

    private function initiateMobileMoneyPayment(Invoice $invoice, PaymentData $data): Payment
    {
        return DB::transaction(function () use ($invoice, $data) {
            $lockedInvoice = Invoice::where('id', $invoice->id)->lockForUpdate()->firstOrFail();

            if ($lockedInvoice->is_fully_paid) {
                throw new InvoiceAlreadyPaidException();
            }

            // We can initiate a pending payment even if it might exceed the balance (business decision: maybe cancel it later, or prevent it here)
            // Let's prevent it here to be safe.
            if ($data->amount > $lockedInvoice->remaining_balance) {
                throw new InsufficientBalanceException();
            }

            $payment = Payment::create([
                'invoice_id' => $lockedInvoice->id,
                'amount' => $data->amount,
                'method' => PaymentMethod::MobileMoney,
                'status' => PaymentStatus::Pending,
                'cashier_id' => $data->cashierId,
            ]);

            return $payment;
        });
    }
}
