<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class HealthCheckController extends Controller
{
    /**
     * Check backend uptime and database connectivity.
     *
     * @return JsonResponse
     */
    public function check(): JsonResponse
    {
        $dbConnected = false;
        try {
            DB::connection()->getPdo();
            $dbConnected = true;
        } catch (Throwable $e) {
            $dbConnected = false;
        }

        $payload = [
            'status' => $dbConnected ? 'healthy' : 'degraded',
            'database' => $dbConnected ? 'connected' : 'disconnected',
            'timestamp' => now()->toIso8601String(),
            'environment' => config('app.env'),
        ];

        return response()->json($payload, $dbConnected ? 200 : 503);
    }
}
