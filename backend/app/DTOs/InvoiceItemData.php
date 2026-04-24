<?php

namespace App\DTOs;

use App\Enums\InvoiceItemCategory;

readonly class InvoiceItemData
{
    public function __construct(
        public string $description,
        public InvoiceItemCategory $category,
        public int $quantity,
        public float $unitPrice,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'description' => $this->description,
            'category' => $this->category->value,
            'quantity' => $this->quantity,
            'unit_price' => $this->unitPrice,
            'total_price' => $this->quantity * $this->unitPrice,
        ];
    }
}
