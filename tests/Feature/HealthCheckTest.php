<?php

namespace Tests\Feature;

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
                'timestamp',
                'environment',
            ])
            ->assertJson([
                'status' => 'healthy',
                'database' => 'connected',
            ]);
    }
}
