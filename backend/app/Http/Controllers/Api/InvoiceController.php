<?php

namespace App\Http\Controllers\Api;

use App\DTOs\InvoiceItemData;
use App\Enums\InvoiceItemCategory;
use App\Enums\VisitStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateInvoiceRequest;
use App\Models\Visit;
use App\Services\InvoiceService;
use Illuminate\Http\JsonResponse;

class InvoiceController extends Controller
{
    public function __construct(
        private readonly InvoiceService $invoiceService
    ) {}

    public function store(CreateInvoiceRequest $request, string $visitId): JsonResponse
    {
        $visit = Visit::findOrFail($visitId);

        if ($visit->status !== VisitStatus::Open) {
            return response()->json(['message' => 'Visit is not open for billing.'], 422);
        }

        if ($visit->invoice()->exists()) {
            return response()->json(['message' => 'Invoice already exists for this visit.'], 422);
        }

        $itemsDto = array_map(function (array $item) {
            return new InvoiceItemData(
                $item['description'],
                InvoiceItemCategory::from($item['category']),
                $item['quantity'],
                $item['unit_price']
            );
        }, $request->validated('items'));

        $invoice = $this->invoiceService->createInvoice($visit, $itemsDto);

        return response()->json(['data' => $invoice], 201);
    }

    public function show(string $invoiceId): JsonResponse
    {
        $invoice = $this->invoiceService->getInvoiceWithDetails($invoiceId);

        // Calculate remaining balance dynamically for the resource
        $invoice->remaining_balance = $invoice->remaining_balance;
        $invoice->is_fully_paid = $invoice->is_fully_paid;

        return response()->json(['data' => $invoice]);
    }
}
