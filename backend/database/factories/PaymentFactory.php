<?php

namespace Database\Factories;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        return [
            'invoice_id' => Invoice::factory(),
            'amount' => $this->faker->randomFloat(2, 100, 1000),
            'method' => PaymentMethod::Cash,
            'status' => PaymentStatus::Pending,
            'cashier_id' => User::factory(),
            'transaction_ref' => null,
            'metadata' => null,
            'confirmed_at' => null,
        ];
    }
}
