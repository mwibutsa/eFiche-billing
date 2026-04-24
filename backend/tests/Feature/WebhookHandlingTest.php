<?php

namespace Tests\Feature;

use App\Enums\InvoiceStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WebhookHandlingTest extends TestCase
{
    use RefreshDatabase;

    private Invoice $invoice;
    private Payment $pendingPayment;

    protected function setUp(): void
    {
        parent::setUp();

        $this->invoice = Invoice::factory()->create([
            'total_amount' => 10000,
            'patient_amount' => 10000,
            'status' => InvoiceStatus::Pending,
        ]);

        $this->pendingPayment = Payment::factory()->create([
            'invoice_id' => $this->invoice->id,
            'amount' => 10000,
            'method' => PaymentMethod::MobileMoney,
            'status' => PaymentStatus::Pending,
            'transaction_ref' => 'REF-12345',
        ]);
    }

    public function test_webhook_confirms_pending_payment(): void
    {
        $payload = [
            'eventId' => 'evt_001',
            'status' => 'PAYMENT_COMPLETE',
            'orderNumber' => 'REF-12345',
            'amount' => 1000000, // 10000.00 * 100
        ];

        $secret = config('efichepay.webhook_secret') ?? 'whsec_test_secret_key_change_in_production';
        $signature = hash_hmac('sha256', json_encode($payload), $secret);

        $response = $this->postJson('/api/webhooks/efichepay', $payload, [
            'X-EfichePay-Signature' => $signature,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(PaymentStatus::Confirmed, $this->pendingPayment->fresh()->status);
        $this->assertEquals(InvoiceStatus::Paid, $this->invoice->fresh()->status);
    }

    public function test_webhook_is_idempotent(): void
    {
        $payload = [
            'eventId' => 'evt_001',
            'status' => 'PAYMENT_COMPLETE',
            'orderNumber' => 'REF-12345',
            'amount' => 1000000,
        ];

        $secret = config('efichepay.webhook_secret') ?? 'whsec_test_secret_key_change_in_production';
        $signature = hash_hmac('sha256', json_encode($payload), $secret);

        // First call
        $this->postJson('/api/webhooks/efichepay', $payload, [
            'X-EfichePay-Signature' => $signature,
        ]);
        $this->assertEquals(1, \App\Models\WebhookEvent::count());

        // Second call with same eventId
        $response = $this->postJson('/api/webhooks/efichepay', $payload, [
            'X-EfichePay-Signature' => $signature,
        ]);

        $response->assertStatus(200);
        $this->assertEquals(1, \App\Models\WebhookEvent::count());
        $this->assertEquals(PaymentStatus::Confirmed, $this->pendingPayment->fresh()->status);
    }

    public function test_webhook_handles_unknown_order_number(): void
    {
        $payload = [
            'eventId' => 'evt_002',
            'status' => 'PAYMENT_COMPLETE',
            'orderNumber' => 'UNKNOWN_REF',
            'amount' => 1000,
        ];

        $secret = config('efichepay.webhook_secret') ?? 'whsec_test_secret_key_change_in_production';
        $signature = hash_hmac('sha256', json_encode($payload), $secret);

        $response = $this->postJson('/api/webhooks/efichepay', $payload, [
            'X-EfichePay-Signature' => $signature,
        ]);

        $response->assertStatus(200); // We return 200 but mark event as failed internally
        $this->assertDatabaseHas('webhook_events', [
            'event_id' => 'evt_002',
            'status' => 'failed',
        ]);
    }
}
