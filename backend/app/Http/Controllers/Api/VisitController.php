<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use Illuminate\Http\JsonResponse;

class VisitController extends Controller
{
    public function index(): JsonResponse
    {
        $visits = Visit::with(['patient', 'invoice'])
            ->latest('visited_at')
            ->limit(10)
            ->get();

        return response()->json(['data' => $visits]);
    }

    public function show(string $visitId): JsonResponse
    {
        $visit = Visit::with(['patient.insurance', 'facility', 'invoice'])->findOrFail($visitId);

        return response()->json(['data' => $visit]);
    }
}
