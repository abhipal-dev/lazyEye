<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;
use App\Http\Controllers\UserController;

class GameRecordLoggingTest extends TestCase
{
    protected $testUserId;

    protected function setUp(): void
    {
        parent::setUp();

        // Ensure sqlite connection for fast, isolated testing
        config(['database.default' => 'sqlite']);

        // Find or create test patient
        $user = DB::table('users')->where('username', 'test_patient_qa')->first();
        if (!$user) {
            $this->testUserId = DB::table('users')->insertGetId([
                'fullname' => 'QA Clinical Test User',
                'username' => 'test_patient_qa',
                'email' => 'qa_patient@lazyeye.test',
                'password' => bcrypt('password123'),
                'accounttype' => 'user',
                'user_playing_time' => 20,
                'game_speed' => 'level-3',
                'left_eye_color' => 'red',
                'right_eye_color' => 'cyan',
                'left_eye_contrastvalue' => 255,
                'right_eye_contrastvalue' => 255,
                'left_eye_contrast_color' => '#ff0000',
                'right_eye_contrast_color' => '#00ffff',
                'created_at' => now(),
                'updated_at' => now()
            ]);
        } else {
            $this->testUserId = $user->id;
        }
    }

    protected function tearDown(): void
    {
        // Cleanup generated test records
        if ($this->testUserId && Schema::hasTable('game_records')) {
            DB::table('game_records')->where('user_id', $this->testUserId)->delete();
        }
        parent::tearDown();
    }

    /**
     * Test recording a valid therapy session via /SaveGameRecords
     */
    public function test_authenticated_patient_can_log_session_record()
    {
        $payload = [
            'id' => $this->testUserId,
            'game_name' => 'Snake',
            'game_score' => 18,
            'duration' => 120,
            'string_score' => json_encode(['Snake' => 18])
        ];

        $response = $this->withSession(['loggedInUser' => $this->testUserId])
                         ->post('/SaveGameRecords', $payload);

        $response->assertStatus(200);
        $response->assertJson(['status' => 'success']);

        if (Schema::hasTable('game_records')) {
            $record = DB::table('game_records')
                        ->where('user_id', $this->testUserId)
                        ->where('game_name', 'Snake')
                        ->orderBy('id', 'desc')
                        ->first();

            $this->assertNotNull($record, 'Expected game_record row to be created in database');
            $this->assertEquals(18, $record->score);
            $this->assertEquals(120, $record->duration_seconds);
        }
    }

    /**
     * Test fallback payload structure parsing (e.g. score matrix array)
     */
    public function test_session_logging_handles_nested_score_array_payload()
    {
        $payload = [
            'id' => $this->testUserId,
            'score' => [
                ['Tetris' => 42]
            ],
            'duration' => 95
        ];

        $response = $this->withSession(['loggedInUser' => $this->testUserId])
                         ->post('/SaveGameRecords', $payload);

        $response->assertStatus(200);
        $response->assertJson(['status' => 'success']);

        if (Schema::hasTable('game_records')) {
            $record = DB::table('game_records')
                        ->where('user_id', $this->testUserId)
                        ->where('game_name', 'Tetris')
                        ->orderBy('id', 'desc')
                        ->first();

            $this->assertNotNull($record);
            $this->assertEquals(42, $record->score);
            $this->assertEquals(95, $record->duration_seconds);
        }
    }

    /**
     * Test daily session reset endpoint only removes today's records
     */
    public function test_daily_therapy_session_reset_purges_only_todays_records()
    {
        if (!Schema::hasTable('game_records')) {
            $this->markTestSkipped('game_records table not available');
        }

        $nowUtc = gmdate('Y-m-d H:i:s');
        $threeDaysAgoUtc = gmdate('Y-m-d H:i:s', strtotime('-3 days'));

        // Insert today record
        DB::table('game_records')->insert([
            'user_id' => $this->testUserId,
            'game_name' => 'Menja',
            'score' => 25,
            'duration_seconds' => 60,
            'played_at' => $nowUtc,
            'created_at' => $nowUtc,
            'updated_at' => $nowUtc
        ]);

        // Insert historical record
        DB::table('game_records')->insert([
            'user_id' => $this->testUserId,
            'game_name' => 'Menja',
            'score' => 30,
            'duration_seconds' => 90,
            'played_at' => $threeDaysAgoUtc,
            'created_at' => $threeDaysAgoUtc,
            'updated_at' => $threeDaysAgoUtc
        ]);

        $response = $this->withSession(['loggedInUser' => $this->testUserId])
                         ->post('/resetTodayRecords', ['id' => $this->testUserId]);

        $response->assertStatus(200);

        // Verify today's record deleted
        $todayRemaining = DB::table('game_records')
                            ->where('user_id', $this->testUserId)
                            ->where('played_at', '>=', gmdate('Y-m-d 00:00:00'))
                            ->count();
        $this->assertEquals(0, $todayRemaining);

        // Verify historical record still exists
        $historicalCount = DB::table('game_records')
                             ->where('user_id', $this->testUserId)
                             ->where('played_at', '<', gmdate('Y-m-d 00:00:00'))
                             ->count();
        $this->assertGreaterThanOrEqual(1, $historicalCount);
    }

    /**
     * Test clinical adherence radar scoring and cohort classification
     */
    public function test_clinical_compliance_radar_calculation()
    {
        $patientActiveToday = (object)[
            'id' => 99901,
            'fullname' => 'Patient Compliant',
            'user_playing_time' => 20
        ];
        $patientActiveLastWeek = (object)[
            'id' => 99902,
            'fullname' => 'Patient Needs Review',
            'user_playing_time' => 20
        ];
        $patientDormant = (object)[
            'id' => 99903,
            'fullname' => 'Patient At Risk',
            'user_playing_time' => 20
        ];

        $cohort = [$patientActiveToday, $patientActiveLastWeek, $patientDormant];

        $result = UserController::enrichPatientsWithCompliance($cohort);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('radar', $result);
        $this->assertArrayHasKey('patients', $result);

        $radar = $result['radar'];
        $this->assertEquals(3, $radar['total_cohort']);
        $this->assertArrayHasKey('compliant_count', $radar);
        $this->assertArrayHasKey('needs_review_count', $radar);
        $this->assertArrayHasKey('at_risk_count', $radar);
    }

    /**
     * Test chromatic lens calibration updates are persisted accurately
     */
    public function test_patient_can_persist_chromatic_lens_calibration()
    {
        $payload = [
            'id' => $this->testUserId,
            'left_eye_color' => 'red',
            'right_eye_color' => 'cyan',
            'left_eye_contrastvalue' => 240,
            'right_eye_contrastvalue' => 220,
            'left_eye_contrast_color' => '#f00000',
            'right_eye_contrast_color' => '#00dcd2',
            'game_speed' => 'progressive'
        ];

        $response = $this->withSession(['loggedInUser' => $this->testUserId])
                         ->post('/saveColorSettings', $payload);

        $response->assertStatus(200);

        $user = DB::table('users')->where('id', $this->testUserId)->first();
        $this->assertEquals('red', $user->left_eye_color);
        $this->assertEquals('cyan', $user->right_eye_color);
        $this->assertEquals(240, $user->left_eye_contrastvalue);
        $this->assertEquals(220, $user->right_eye_contrastvalue);
        $this->assertEquals('progressive', $user->game_speed);
    }
}
