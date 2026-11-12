<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    /**
     * Test the API health check endpoint returns 200 and expected payload structure.
     *
     * @return void
     */
    public function test_health_check_returns_healthy_status_and_json_payload()
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'database',
                'latency_ms',
                'timestamp',
                'environment',
            ])
            ->assertJson([
                'status' => 'healthy',
                'database' => 'connected',
            ]);

        $data = $response->json();
        $this->assertIsNumeric($data['latency_ms']);
    }

    /**
     * Test health check gracefully reports degraded status on database failure.
     *
     * @return void
     */
    public function test_health_check_handles_database_disconnection_gracefully()
    {
        DB::shouldReceive('connection->getPdo')
            ->andThrow(new \Exception('Database connection failed'));

        $response = $this->getJson('/api/health');

        $response->assertStatus(503)
            ->assertJson([
                'status' => 'degraded',
                'database' => 'disconnected',
            ]);
    }
}
