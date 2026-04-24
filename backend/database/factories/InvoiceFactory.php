<?php

namespace Database\Factories;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\Visit;
use Illuminate\Database\Eloquent\Factories\Factory;

class InvoiceFactory extends Factory
{
    protected $model = Invoice::class;

    public function definition(): array
    {
        $amount = $this->faker->randomFloat(2, 1000, 50000);

        return [
            'visit_id' => Visit::factory(),
            'total_amount' => $amount,
            'insurance_amount' => 0,
            'patient_amount' => $amount,
            'status' => InvoiceStatus::Pending,
        ];
    }
}
