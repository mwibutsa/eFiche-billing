<?php

namespace App\Http\Controllers\Api;

use App\DTOs\PaymentData;
use App\Enums\PaymentMethod;
use App\Exceptions\InsufficientBalanceException;
use App\Exceptions\InvoiceAlreadyPaidException;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProcessPaymentRequest;
use App\Models\Invoice;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function __construct(
        private readonly PaymentService $paymentService
    ) {}

    public function store(ProcessPaymentRequest $request, string $invoiceId): JsonResponse
    {
        $invoice = Invoice::findOrFail($invoiceId);

        $paymentData = new PaymentData(
            amount: $request->validated('amount'),
            method: PaymentMethod::from($request->validated('method')),
            cashierId: Auth::id() // Handled by Sanctum
        );

        try {
            $payment = $this->paymentService->processPayment($invoice, $paymentData);

            return response()->json(['data' => $payment], 201);
        } catch (InvoiceAlreadyPaidException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        } catch (InsufficientBalanceException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred while processing the payment.'], 500);
        }
    }
}
