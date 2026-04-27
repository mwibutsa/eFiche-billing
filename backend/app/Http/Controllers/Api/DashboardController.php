<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $totalBilled = Invoice::sum('patient_amount');
        $totalCollected = Payment::where('status', 'confirmed')->sum('amount');

        $collectionRate = $totalBilled > 0 ? ($totalCollected / $totalBilled) * 100 : 0;

        $pendingInvoices = Invoice::where('status', '!=', 'paid')->count();

        return response()->json([
            'data' => [
                'total_billed' => number_format($totalBilled, 0, '.', ''),
                'total_collected' => number_format($totalCollected, 0, '.', ''),
                'collection_rate' => round($collectionRate, 1),
                'pending_invoices' => $pendingInvoices,
                'avg_processing_time' => '4m 12s', // Placeholder for now
            ],
        ]);
    }
}
