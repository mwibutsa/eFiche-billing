<?php

namespace Tests\Feature;

use App\Enums\InvoiceItemCategory;
use App\Enums\VisitStatus;
use App\Models\Facility;
use App\Models\User;
use App\Models\Visit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class InvoiceCreationTest extends TestCase
{
    use RefreshDatabase;

    private User $cashier;

    private Facility $facility;

    private Visit $visit;

    protected function setUp(): void
    {
        parent::setUp();

        $this->facility = Facility::factory()->create();
        $this->cashier = User::factory()->create([
            'facility_id' => $this->facility->id,
            'role' => 'cashier',
        ]);

        $this->visit = Visit::factory()->create([
            'facility_id' => $this->facility->id,
            'status' => VisitStatus::Open,
        ]);

        Sanctum::actingAs($this->cashier);
    }

    public function test_can_create_invoice_for_open_visit(): void
    {
        $payload = [
            'items' => [
                [
                    'description' => 'Consultation',
                    'category' => InvoiceItemCategory::Consultation->value,
                    'quantity' => 1,
                    'unit_price' => 5000,
                ],
                [
                    'description' => 'Aspirin',
                    'category' => InvoiceItemCategory::Medication->value,
                    'quantity' => 2,
                    'unit_price' => 500,
                ],
            ],
        ];

        $response = $this->postJson("/api/visits/{$this->visit->id}/invoices", $payload);

        $response->assertStatus(201);
        $response->assertJsonPath('data.total_amount', '6000.00');
        $response->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('invoices', [
            'visit_id' => $this->visit->id,
            'total_amount' => 6000,
        ]);

        $this->assertEquals(VisitStatus::Billed, $this->visit->fresh()->status);
    }

    public function test_cannot_create_duplicate_invoice_for_visit(): void
    {
        $payload = [
            'items' => [
                ['description' => 'Test', 'category' => 'consultation', 'quantity' => 1, 'unit_price' => 1000],
            ],
        ];

        // Create first invoice
        $this->postJson("/api/visits/{$this->visit->id}/invoices", $payload);

        // Try second one
        $response = $this->postJson("/api/visits/{$this->visit->id}/invoices", $payload);

        $response->assertStatus(422);
        $response->assertJsonFragment(['message' => 'Visit is not open for billing.']);
    }

    public function test_cannot_create_invoice_for_discharged_visit(): void
    {
        $this->visit->update(['status' => VisitStatus::Discharged]);

        $payload = [
            'items' => [
                ['description' => 'Test', 'category' => 'consultation', 'quantity' => 1, 'unit_price' => 1000],
            ],
        ];

        $response = $this->postJson("/api/visits/{$this->visit->id}/invoices", $payload);

        $response->assertStatus(422);
        $response->assertJsonFragment(['message' => 'Visit is not open for billing.']);
    }
}
