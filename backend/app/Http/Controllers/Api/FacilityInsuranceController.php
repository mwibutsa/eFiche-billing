<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\JsonResponse;

class FacilityInsuranceController extends Controller
{
    public function index(string $facilityId): JsonResponse
    {
        $facility = Facility::findOrFail($facilityId);

        $insurances = $facility->insurances()
            ->wherePivot('is_active', true)
            ->get();

        return response()->json(['data' => $insurances]);
    }
}
