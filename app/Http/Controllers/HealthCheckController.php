<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class HealthCheckController extends Controller
{
    /**
     * Check backend uptime, database connectivity, and query latency.
     *
     * @return JsonResponse
     */
    public function check(): JsonResponse
    {
        $dbConnected = false;
        $dbLatencyMs = null;
        $start = microtime(true);

        try {
            DB::connection()->getPdo();
            $dbConnected = true;
            $dbLatencyMs = round((microtime(true) - $start) * 1000, 2);
        } catch (Throwable $e) {
            $dbConnected = false;
        }

        $payload = [
            'status' => $dbConnected ? 'healthy' : 'degraded',
            'database' => $dbConnected ? 'connected' : 'disconnected',
            'latency_ms' => $dbLatencyMs,
            'timestamp' => now()->toIso8601String(),
            'environment' => config('app.env'),
        ];

        return response()->json($payload, $dbConnected ? 200 : 503);
    }
}
