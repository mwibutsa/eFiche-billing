<?php

use App\Http\Controllers\Api\FacilityInsuranceController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\VisitController;
use App\Http\Controllers\Api\WebhookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('visits/{visit}/invoices', [InvoiceController::class, 'store']);
    Route::get('invoices/{invoice}', [InvoiceController::class, 'show']);
    Route::post('invoices/{invoice}/payments', [PaymentController::class, 'store']);
    Route::get('facilities/{facility}/insurances', [FacilityInsuranceController::class, 'index']);
    Route::get('visits/{visit}', [VisitController::class, 'show']);
});

Route::middleware(['efichepay.webhook'])->group(function () {
    Route::post('webhooks/efichepay', [WebhookController::class, 'handleEfichePay']);
});
