<?php

namespace App\DTOs;

use App\Enums\PaymentMethod;

readonly class PaymentData
{
    public function __construct(
        public float $amount,
        public PaymentMethod $method,
        public ?int $cashierId = null,
    ) {}
}
