<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\WebhookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    public function __construct(
        private readonly WebhookService $webhookService
    ) {}

    public function handleEfichePay(Request $request): JsonResponse
    {
        $this->webhookService->handleEfichePayWebhook($request->all());

        return response()->json(['status' => 'ok']);
    }
}
