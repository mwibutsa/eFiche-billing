<?php

namespace App\Services;

use App\DTOs\InvoiceItemData;
use App\Enums\InvoiceStatus;
use App\Enums\VisitStatus;
use App\Models\Invoice;
use App\Models\Visit;
use Illuminate\Support\Facades\DB;

class InvoiceService
{
    /**
     * @param  InvoiceItemData[]  $items
     */
    public function createInvoice(Visit $visit, array $items): Invoice
    {
        return DB::transaction(function () use ($visit, $items) {
            $totalAmount = 0;
            $itemsData = [];

            foreach ($items as $item) {
                $totalAmount += ($item->quantity * $item->unitPrice);
                $itemsData[] = $item->toArray();
            }

            // In V1, we assume patient pays full amount if insurance logic is not fully integrated
            // For now, patient pays everything.
            $invoice = Invoice::create([
                'visit_id' => $visit->id,
                'total_amount' => $totalAmount,
                'insurance_amount' => 0,
                'patient_amount' => $totalAmount,
                'status' => InvoiceStatus::Pending,
            ]);

            $invoice->items()->createMany($itemsData);

            $visit->update(['status' => VisitStatus::Billed]);

            return $invoice->load('items');
        });
    }

    public function getInvoiceWithDetails(string $invoiceId): Invoice
    {
        return Invoice::with(['items', 'payments', 'visit.patient'])->findOrFail($invoiceId);
    }
}
