<?php

use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FacilityInsuranceController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\VisitController;
use App\Http\Controllers\Api\WebhookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('visits', [VisitController::class, 'index']);
Route::get('visits/{visit}', [VisitController::class, 'show']);
Route::get('stats', [DashboardController::class, 'stats']);
Route::get('invoices/{invoice}', [InvoiceController::class, 'show']);
Route::post('visits/{visit}/invoices', [InvoiceController::class, 'store']);
Route::post('invoices/{invoice}/payments', [PaymentController::class, 'store']);
Route::get('facilities/{facility}/insurances', [FacilityInsuranceController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::middleware(['efichepay.webhook'])->group(function () {
    Route::post('webhooks/efichepay', [WebhookController::class, 'handleEfichePay']);
});
