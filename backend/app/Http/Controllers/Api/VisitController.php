<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use Illuminate\Http\JsonResponse;

class VisitController extends Controller
{
    public function show(string $visitId): JsonResponse
    {
        $visit = Visit::with(['patient.insurance', 'facility', 'invoice'])->findOrFail($visitId);

        return response()->json(['data' => $visit]);
    }
}
