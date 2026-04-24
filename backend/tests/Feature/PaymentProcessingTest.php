<?php

namespace Tests\Feature;

use App\Enums\InvoiceStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PaymentProcessingTest extends TestCase
{
    use RefreshDatabase;

    private User $cashier;

    private Invoice $invoice;

    protected function setUp(): void
    {
        parent::setUp();

        $this->cashier = User::factory()->create(['role' => 'cashier']);
        $this->invoice = Invoice::factory()->create([
            'total_amount' => 10000,
            'patient_amount' => 10000,
            'status' => InvoiceStatus::Pending,
        ]);

        Sanctum::actingAs($this->cashier);
    }

    public function test_can_process_full_cash_payment(): void
    {
        $payload = [
            'amount' => 10000,
            'method' => PaymentMethod::Cash->value,
        ];

        $response = $this->postJson("/api/invoices/{$this->invoice->id}/payments", $payload);

        $response->assertStatus(201);
        $this->assertEquals(InvoiceStatus::Paid, $this->invoice->fresh()->status);
        $this->assertDatabaseHas('payments', [
            'invoice_id' => $this->invoice->id,
            'amount' => 10000,
            'status' => PaymentStatus::Confirmed,
        ]);
    }

    public function test_can_process_partial_cash_payment(): void
    {
        $payload = [
            'amount' => 4000,
            'method' => PaymentMethod::Cash->value,
        ];

        $response = $this->postJson("/api/invoices/{$this->invoice->id}/payments", $payload);

        $response->assertStatus(201);
        $this->assertEquals(InvoiceStatus::PartiallyPaid, $this->invoice->fresh()->status);
        $this->assertEquals('6000.00', $this->invoice->fresh()->remaining_balance);
    }

    public function test_cannot_overpay_invoice(): void
    {
        $payload = [
            'amount' => 11000,
            'method' => PaymentMethod::Cash->value,
        ];

        $response = $this->postJson("/api/invoices/{$this->invoice->id}/payments", $payload);

        $response->assertStatus(422);
        $response->assertJsonFragment(['message' => 'Overpayment not allowed: amount exceeds remaining balance.']);
    }

    public function test_cannot_pay_already_paid_invoice(): void
    {
        $this->invoice->update(['status' => InvoiceStatus::Paid]);
        // Add a payment to make remaining_balance 0
        Payment::factory()->create([
            'invoice_id' => $this->invoice->id,
            'amount' => 10000,
            'status' => PaymentStatus::Confirmed,
        ]);

        $payload = [
            'amount' => 1000,
            'method' => PaymentMethod::Cash->value,
        ];

        $response = $this->postJson("/api/invoices/{$this->invoice->id}/payments", $payload);

        $response->assertStatus(422);
        $response->assertJsonFragment(['message' => 'Invoice is already fully paid.']);
    }

    public function test_mobile_money_payment_starts_as_pending(): void
    {
        $payload = [
            'amount' => 5000,
            'method' => PaymentMethod::MobileMoney->value,
        ];

        $response = $this->postJson("/api/invoices/{$this->invoice->id}/payments", $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('payments', [
            'invoice_id' => $this->invoice->id,
            'amount' => 5000,
            'method' => PaymentMethod::MobileMoney->value,
            'status' => PaymentStatus::Pending,
        ]);

        // Invoice status shouldn't change yet
        $this->assertEquals(InvoiceStatus::Pending, $this->invoice->fresh()->status);
    }
}
