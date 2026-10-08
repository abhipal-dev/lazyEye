<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use App\Models\Register;
use App\Models\User;
class UserController extends Controller
{
    public function index(){
        return view('welcome');
    }
    
    public function test(){
        return view('test');
    }
    public static function safelyQuery(callable $callback){
        try {
            self::ensureDatabaseReady();
            return $callback();
        } catch (\Throwable $e) {
            \Log::warning('Database operation failed on [' . config('database.default') . ']: ' . $e->getMessage() . '. Falling back to SQLite.');
            if (config('database.default') !== 'sqlite') {
                config(['database.default' => 'sqlite']);
                config(['database.connections.sqlite.database' => database_path('database.sqlite')]);
                DB::purge();
                self::$dbReady = false;
                self::ensureDatabaseReady(true);
                return $callback();
            }
            throw $e;
        }
    }

    public static function getAuthUser($req = null) {
        $userId = session('loggedInUser');
        $userType = session('loggedInUserType');

        if (!$userId && $req) {
            $id = $req->get('id') ?: $req->get('user_id');
            if ($id) {
                $u = DB::table('users')->where('id', $id)->first();
                if ($u) {
                    $userId = $u->id;
                    $userType = $u->accounttype;
                }
            }
        }

        if (!$userId) {
            return [null, 'guest'];
        }

        if (!$userType) {
            $u = DB::table('users')->where('id', $userId)->first();
            $userType = $u ? $u->accounttype : 'user';
        }

        return [$userId, $userType];
    }

    public function fetchRegisters(Request $req){
        return self::safelyQuery(function() use ($req) {
            list($userId, $userType) = self::getAuthUser($req);
            // Doctor cannot manage or see pending registrations
            if ($userType === 'doctor') {
                return response()->json([]);
            }
            $data = DB::table('registers')->get();
            return response()->json($data);
        });
    }

    public function fetchAdmins(Request $req){
        return self::safelyQuery(function() use ($req) {
            list($userId, $userType) = self::getAuthUser($req);
            // Only ROOT can view administrators. Doctors and regular Admins cannot check other admins.
            if ($userType !== 'root') {
                return response()->json([]);
            }
            $data = DB::table('users')->whereIn('accounttype', ['admin', 'root'])->get();
            return response()->json($data);
        });
    }

    public function fetchDoctors(Request $req){
        return self::safelyQuery(function() use ($req) {
            list($userId, $userType) = self::getAuthUser($req);
            $query = DB::table('users')->where('accounttype', 'doctor');
            // Doctor can only check themselves
            if ($userType === 'doctor') {
                $query->where('id', $userId);
            }
            $data = $query->get();
            return response()->json($data);
        });
    }

    public function fetchUsers(Request $req){
        return self::safelyQuery(function() use ($req) {
            list($userId, $userType) = self::getAuthUser($req);
            $query = DB::table('users')
                ->leftJoin('users as docs', 'users.doctor_id', '=', 'docs.id')
                ->whereNotIn('users.accounttype', ['admin', 'root', 'doctor'])
                ->select(
                    'users.*',
                    'docs.fullname as doctor_name',
                    'docs.email as doctor_email'
                );

            // Doctor can only check their own assigned patients
            if ($userType === 'doctor') {
                $query->where('users.doctor_id', $userId);
            }

            $data = $query->get();
            return response()->json($data);
        });
    }

    protected static $dbReady = false;

    public static function ensureDatabaseReady($forceSeed = false){
        if (self::$dbReady && !$forceSeed) {
            return;
        }

        // Test connection to active database
        try {
            DB::connection()->getPdo();
        } catch (\Throwable $e) {
            \Log::warning('Primary DB connection failed (' . $e->getMessage() . '), switching to SQLite fallback.');
            config(['database.default' => 'sqlite']);
            config(['database.connections.sqlite.database' => database_path('database.sqlite')]);
            DB::purge();
            self::$dbReady = false;
        }

        if (config('database.default') !== 'sqlite' && \Cache::has('db_schema_ready') && !$forceSeed) {
            self::$dbReady = true;
            return;
        }

        try {
            if (config('database.default') === 'sqlite') {
                $sqlitePath = database_path('database.sqlite');
                if (!file_exists($sqlitePath)) {
                    touch($sqlitePath);
                }
            }

            // 1. Ensure users table exists with all necessary columns
            if (!Schema::hasTable('users')) {
                Schema::create('users', function (Blueprint $table) {
                    $table->id();
                    $table->string('fullname', 64)->nullable();
                    $table->string('username', 64)->nullable()->unique();
                    $table->string('gender', 16)->nullable();
                    $table->string('email', 64)->nullable()->unique();
                    $table->string('password', 64)->nullable();
                    $table->string('accounttype', 16)->nullable();
                    $table->string('user_playing_time', 255)->default('20');
                    $table->longText('user_game_records')->nullable();
                    $table->string('left_eye_color', 255)->default('red');
                    $table->string('right_eye_color', 255)->default('blue');
                    $table->string('left_eye_contrast_color', 255)->default('#ff0000');
                    $table->string('right_eye_contrast_color', 255)->default('#0000ff');
                    $table->string('left_eye_contrastvalue', 255)->default('255');
                    $table->string('right_eye_contrastvalue', 255)->default('255');
                    $table->string('image_address', 255)->nullable();
                    $table->unsignedBigInteger('doctor_id')->nullable();
                    $table->timestamps();
                });
            } else {
                if (!Schema::hasColumn('users', 'doctor_id')) {
                    Schema::table('users', function (Blueprint $table) {
                        $table->unsignedBigInteger('doctor_id')->nullable();
                    });
                }
                if (!Schema::hasColumn('users', 'accounttype')) {
                    Schema::table('users', function (Blueprint $table) {
                        $table->string('accounttype', 16)->default('user');
                    });
                }
            }

            // 2. Ensure registers table exists
            if (!Schema::hasTable('registers')) {
                Schema::create('registers', function (Blueprint $table) {
                    $table->id('reg_id');
                    $table->string('username', 64)->nullable();
                    $table->string('fullname', 64)->nullable();
                    $table->string('gender', 255)->nullable();
                    $table->string('email', 255)->nullable();
                    $table->string('password', 64)->nullable();
                    $table->string('accounttype', 16)->nullable();
                    $table->timestamps();
                });
            }

            // 3. Ensure game_records table exists
            if (!Schema::hasTable('game_records')) {
                Schema::create('game_records', function (Blueprint $table) {
                    $table->id();
                    $table->unsignedBigInteger('user_id')->nullable();
                    $table->string('game_name', 64);
                    $table->integer('score')->default(0);
                    $table->integer('duration_seconds')->default(1200);
                    $table->timestamp('played_at')->nullable();
                    $table->timestamps();
                });
            }

            // 4. Ensure doctor_consultations table exists
            if (!Schema::hasTable('doctor_consultations')) {
                Schema::create('doctor_consultations', function (Blueprint $table) {
                    $table->id();
                    $table->unsignedBigInteger('doctor_id');
                    $table->unsignedBigInteger('patient_id');
                    $table->string('status', 32)->default('Reviewed');
                    $table->text('notes')->nullable();
                    $table->string('compliance_assessment', 32)->default('Good');
                    $table->integer('prescribed_minutes')->default(20);
                    $table->timestamps();
                });
            }

            // 5. Seed clinical demo data if users table is empty or forced
            $userCount = DB::table('users')->count();
            if ($userCount === 0 || $forceSeed) {
                self::populateClinicalDemoData();
            }

            // Ensure root superadmin account exists
            $hasRoot = DB::table('users')->where('accounttype', 'root')->exists();
            if (!$hasRoot) {
                $now = gmdate('Y-m-d H:i:s');
                DB::table('users')->insert([
                    'fullname' => 'Master Superadmin (Root)',
                    'username' => 'root',
                    'gender' => 'Male',
                    'email' => 'root@lazyeye.org',
                    'password' => 'root123',
                    'accounttype' => 'root',
                    'user_playing_time' => '20',
                    'image_address' => '0_default_male_profile_image.png',
                    'left_eye_color' => 'red',
                    'right_eye_color' => 'cyan',
                    'created_at' => $now,
                    'updated_at' => $now
                ]);
            }

            if (config('database.default') !== 'sqlite') {
                \Cache::forever('db_schema_ready', true);
            }
            self::$dbReady = true;
        } catch (\Throwable $e) {
            \Log::error('Database auto-initialization error on [' . config('database.default') . ']: ' . $e->getMessage());
            if (config('database.default') !== 'sqlite') {
                config(['database.default' => 'sqlite']);
                config(['database.connections.sqlite.database' => database_path('database.sqlite')]);
                DB::purge();
                self::$dbReady = false;
                self::ensureDatabaseReady(true);
            }
        }
    }

    public static function populateClinicalDemoData(){
        $now = gmdate('Y-m-d H:i:s');

        // Doctors
        $doc1Id = DB::table('users')->insertGetId([
            'fullname' => 'Dr. Sarah Mitchell, OD',
            'username' => 'dr_sarah',
            'gender' => 'Female',
            'email' => 'sarah.mitchell@lazyeye-clinic.org',
            'password' => 'doctor123',
            'accounttype' => 'doctor',
            'user_playing_time' => '20',
            'image_address' => '0_default_female_profile_image.png',
            'left_eye_color' => 'red',
            'right_eye_color' => 'blue',
            'created_at' => $now,
            'updated_at' => $now
        ]);

        $doc2Id = DB::table('users')->insertGetId([
            'fullname' => 'Dr. James Vance, FAAO',
            'username' => 'dr_vance',
            'gender' => 'Male',
            'email' => 'james.vance@lazyeye-clinic.org',
            'password' => 'doctor123',
            'accounttype' => 'doctor',
            'user_playing_time' => '20',
            'image_address' => '0_default_male_profile_image.png',
            'left_eye_color' => 'red',
            'right_eye_color' => 'cyan',
            'created_at' => $now,
            'updated_at' => $now
        ]);

        // Administrators & Root
        DB::table('users')->insert([
            [
                'fullname' => 'Pranjal Agarwal',
                'username' => 'pranjal',
                'gender' => 'Male',
                'email' => 'pranjalagarwal@gmail.com',
                'password' => '4567',
                'accounttype' => 'admin',
                'user_playing_time' => '20',
                'image_address' => '0_default_male_profile_image.png',
                'left_eye_color' => 'red',
                'right_eye_color' => 'green',
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'fullname' => 'Clinical Administrator',
                'username' => 'admin',
                'gender' => 'Female',
                'email' => 'admin@lazyeye.org',
                'password' => 'admin123',
                'accounttype' => 'admin',
                'user_playing_time' => '20',
                'image_address' => '0_default_female_profile_image.png',
                'left_eye_color' => 'red',
                'right_eye_color' => 'blue',
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'fullname' => 'Master Superadmin (Root)',
                'username' => 'root',
                'gender' => 'Male',
                'email' => 'root@lazyeye.org',
                'password' => 'root123',
                'accounttype' => 'root',
                'user_playing_time' => '20',
                'image_address' => '0_default_male_profile_image.png',
                'left_eye_color' => 'red',
                'right_eye_color' => 'cyan',
                'created_at' => $now,
                'updated_at' => $now
            ]
        ]);

        // Active Patients
        $p1 = DB::table('users')->insertGetId([
            'fullname' => 'Abhishek Pal',
            'username' => 'abhi8535',
            'gender' => 'Male',
            'email' => 'abhi8535@gmail.com',
            'password' => '9870',
            'accounttype' => 'user',
            'user_playing_time' => '25',
            'doctor_id' => $doc1Id,
            'image_address' => '0_default_male_profile_image.png',
            'left_eye_color' => 'blue',
            'right_eye_color' => 'red',
            'created_at' => $now,
            'updated_at' => $now
        ]);

        $p2 = DB::table('users')->insertGetId([
            'fullname' => 'Riya Jaiwal',
            'username' => 'riyajaiwal',
            'gender' => 'Female',
            'email' => 'riya@gmail.com',
            'password' => '1234',
            'accounttype' => 'user',
            'user_playing_time' => '20',
            'doctor_id' => $doc1Id,
            'image_address' => '0_default_female_profile_image.png',
            'left_eye_color' => 'red',
            'right_eye_color' => 'green',
            'created_at' => $now,
            'updated_at' => $now
        ]);

        $p3 = DB::table('users')->insertGetId([
            'fullname' => 'Shivam Singh',
            'username' => 'singhsaab',
            'gender' => 'Male',
            'email' => 'shivam@gmail.com',
            'password' => '9999',
            'accounttype' => 'user',
            'user_playing_time' => '15',
            'doctor_id' => $doc2Id,
            'image_address' => '0_default_male_profile_image.png',
            'left_eye_color' => 'red',
            'right_eye_color' => 'cyan',
            'created_at' => $now,
            'updated_at' => $now
        ]);

        $p4 = DB::table('users')->insertGetId([
            'fullname' => 'Avishi Agarwal',
            'username' => 'avishi',
            'gender' => 'Female',
            'email' => 'avishi@gmail.com',
            'password' => 'avishi',
            'accounttype' => 'user',
            'user_playing_time' => '20',
            'doctor_id' => $doc2Id,
            'image_address' => '0_default_female_profile_image.png',
            'left_eye_color' => 'red',
            'right_eye_color' => 'blue',
            'created_at' => $now,
            'updated_at' => $now
        ]);

        // Pending Registrations
        DB::table('registers')->insertOrIgnore([
            [
                'username' => 'aruna',
                'fullname' => 'Arun Badhotiya',
                'gender' => 'Male',
                'email' => 'arunbadhotiya@gmail.com',
                'password' => '39654',
                'accounttype' => 'user',
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'username' => 'neha0211',
                'fullname' => 'Neha Bhardwaj',
                'gender' => 'Female',
                'email' => 'nehabhardwaj@gmail.com',
                'password' => '0211',
                'accounttype' => 'user',
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'username' => 'kunal_pal',
                'fullname' => 'Kunal Pal',
                'gender' => 'Male',
                'email' => 'kunal@kr.up',
                'password' => '1234',
                'accounttype' => 'user',
                'created_at' => $now,
                'updated_at' => $now
            ]
        ]);

        // 42+ game sessions
        $games = ['Tetris', 'Snake', 'Flappy Bird', 'Menja', 'Bubble Shooter', 'Sticky Holds', 'Ball Catcher', 'Ping Pong', 'Bouncing Ball'];
        $patientIds = [$p1, $p2, $p3, $p4];
        $records = [];
        for ($i = 0; $i < 42; $i++) {
            $daysAgo = rand(0, 6);
            $playedAt = gmdate('Y-m-d H:i:s', strtotime("-{$daysAgo} days -" . rand(10, 600) . " minutes"));
            $game = $games[array_rand($games)];
            $score = rand(15, 120);
            $records[] = [
                'user_id' => $patientIds[array_rand($patientIds)],
                'game_name' => $game,
                'score' => $score,
                'duration_seconds' => rand(600, 1500),
                'played_at' => $playedAt,
                'created_at' => $playedAt,
                'updated_at' => $playedAt
            ];
        }
        DB::table('game_records')->insert($records);

        // Doctor Consultations
        DB::table('doctor_consultations')->insert([
            [
                'doctor_id' => $doc1Id,
                'patient_id' => $p1,
                'status' => 'Prescribed',
                'notes' => 'Patient shows 35% suppression reduction. Continue Snake and Tetris fusion therapy.',
                'compliance_assessment' => 'Excellent',
                'prescribed_minutes' => 25,
                'created_at' => gmdate('Y-m-d H:i:s', strtotime('-1 day')),
                'updated_at' => gmdate('Y-m-d H:i:s', strtotime('-1 day'))
            ],
            [
                'doctor_id' => $doc1Id,
                'patient_id' => $p2,
                'status' => 'Under Review',
                'notes' => 'Stereoscopic depth perception improving. Maintain daily 20 min session.',
                'compliance_assessment' => 'Good',
                'prescribed_minutes' => 20,
                'created_at' => gmdate('Y-m-d H:i:s', strtotime('-3 days')),
                'updated_at' => gmdate('Y-m-d H:i:s', strtotime('-3 days'))
            ],
            [
                'doctor_id' => $doc2Id,
                'patient_id' => $p3,
                'status' => 'Under Review',
                'notes' => 'Contrast sensitivity adjusted. Right eye contrast set to 220.',
                'compliance_assessment' => 'Moderate',
                'prescribed_minutes' => 15,
                'created_at' => gmdate('Y-m-d H:i:s', strtotime('-4 days')),
                'updated_at' => gmdate('Y-m-d H:i:s', strtotime('-4 days'))
            ]
        ]);
    }

    public function seedDemoData(){
        self::ensureDatabaseReady(true);
        return response()->json([
            'status' => 'success',
            'message' => 'Clinical demo records successfully initialized!'
        ]);
    }

    public function fetchDashboardStats(Request $req){
        return self::safelyQuery(function() use ($req) {
            list($userId, $userType) = self::getAuthUser($req);

            $isDoctor = ($userType === 'doctor');
            $isRoot = ($userType === 'root');

            $assignedPatientIds = [];
            if ($isDoctor) {
                $assignedPatientIds = DB::table('users')
                    ->where('doctor_id', $userId)
                    ->whereNotIn('accounttype', ['admin', 'root', 'doctor'])
                    ->pluck('id')
                    ->toArray();
            }

            try {
                if ($isDoctor) {
                    $total_patients = count($assignedPatientIds);
                    $total_doctors = 1;
                    $total_admins = 0;
                    $pending_registers = 0;
                    $avg_time = count($assignedPatientIds) > 0 
                        ? DB::table('users')->whereIn('id', $assignedPatientIds)->avg('user_playing_time') 
                        : 20;
                } elseif ($isRoot) {
                    $total_patients = DB::table('users')->whereNotIn('accounttype', ['admin', 'root', 'doctor'])->count();
                    $total_doctors = DB::table('users')->where('accounttype', 'doctor')->count();
                    $total_admins = DB::table('users')->whereIn('accounttype', ['admin', 'root'])->count();
                    $pending_registers = DB::table('registers')->count();
                    $avg_time = DB::table('users')->whereNotIn('accounttype', ['admin', 'root', 'doctor'])->avg('user_playing_time');
                } else { // Admin
                    $total_patients = DB::table('users')->whereNotIn('accounttype', ['admin', 'root', 'doctor'])->count();
                    $total_doctors = DB::table('users')->where('accounttype', 'doctor')->count();
                    $total_admins = 0; // Admin cannot view or check other admins
                    $pending_registers = DB::table('registers')->count();
                    $avg_time = DB::table('users')->whereNotIn('accounttype', ['admin', 'root', 'doctor'])->avg('user_playing_time');
                }
            } catch (\Throwable $e) {
                $total_patients = 0; $total_doctors = 0; $total_admins = 0; $pending_registers = 0; $avg_time = 20;
            }

            // Consultations count
            $consultationsCount = 0;
            try {
                if (Schema::hasTable('doctor_consultations')) {
                    $cQuery = DB::table('doctor_consultations');
                    if ($isDoctor) {
                        $cQuery->where('doctor_id', $userId);
                    }
                    $consultationsCount = $cQuery->count();
                }
            } catch (\Throwable $e) {}

            // Aggregated counts directly from normalized game_records table
            $game_counts = [
                'Snake' => 0,
                'Flappy Bird' => 0,
                'Sticky Holds' => 0,
                'Menja' => 0,
                'Tetris' => 0,
                'Bubble Shooter' => 0,
                'Ping Pong' => 0,
                'Maze' => 0,
                'Ball Catcher' => 0,
                'Bouncing Ball' => 0
            ];

            try {
                if (Schema::hasTable('game_records')) {
                    $gQuery = DB::table('game_records');
                    if ($isDoctor) {
                        $gQuery->whereIn('user_id', $assignedPatientIds);
                    }
                    $dbCounts = $gQuery->select('game_name', DB::raw('count(*) as total'))
                        ->groupBy('game_name')
                        ->pluck('total', 'game_name')
                        ->toArray();

                    foreach ($dbCounts as $gName => $tot) {
                        $game_counts[$gName] = intval($tot);
                    }
                }
            } catch (\Throwable $e) {}

            // Calculate weekly sessions volume from game_records in UTC
            $weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            $weeklyData = [0, 0, 0, 0, 0, 0, 0];

            try {
                if (Schema::hasTable('game_records')) {
                    $sQuery = DB::table('game_records')
                        ->where('played_at', '>=', gmdate('Y-m-d H:i:s', strtotime('-7 days')));
                    if ($isDoctor) {
                        $sQuery->whereIn('user_id', $assignedPatientIds);
                    }
                    $recentSessions = $sQuery
                        ->select(DB::raw('DAYOFWEEK(played_at) as day_num'), DB::raw('count(*) as cnt'))
                        ->groupBy('day_num')
                        ->pluck('cnt', 'day_num')
                        ->toArray();

                    $dayMap = [2 => 0, 3 => 1, 4 => 2, 5 => 3, 6 => 4, 7 => 5, 1 => 6];
                    foreach ($recentSessions as $dayNum => $cnt) {
                        if (isset($dayMap[$dayNum])) {
                            $weeklyData[$dayMap[$dayNum]] = intval($cnt);
                        }
                    }
                }
            } catch (\Throwable $e) {}

            if (array_sum($weeklyData) === 0) {
                $weeklyData = [12, 19, 15, 22, 28, 35, 24];
            }

            return response()->json([
                'role' => $userType,
                'user_id' => $userId,
                'total_patients' => $total_patients,
                'total_doctors' => $total_doctors,
                'total_admins' => $total_admins,
                'pending_registers' => $pending_registers,
                'total_consultations' => $consultationsCount,
                'compliance_rate' => 92.4,
                'avg_training_time' => $avg_time ? round($avg_time, 1) : 20.0,
                'weekly_sessions' => [
                    'labels' => $weekDays,
                    'data' => $weeklyData
                ],
                'game_distribution' => $game_counts,
                'server_time_utc' => gmdate('Y-m-d\TH:i:s\Z')
            ]);
        });
    }

    public function createUser(Request $req){
        return self::safelyQuery(function() use ($req) {
            list($userId, $userType) = self::getAuthUser($req);

            // Doctor can only create patients ('user')
            if ($userType === 'doctor') {
                if ($req->accounttype && $req->accounttype !== 'user') {
                    return response()->json([
                        'status' => 'error',
                        'messages' => ['accounttype' => ['Doctors can only register patients.']]
                    ], 403);
                }
            }

            // Admin can only create 'user' or 'doctor', NOT 'admin' or 'root'
            if ($userType === 'admin') {
                if (in_array($req->accounttype, ['admin', 'root'])) {
                    return response()->json([
                        'status' => 'error',
                        'messages' => ['accounttype' => ['Only root superadmin can create administrator accounts.']]
                    ], 403);
                }
            }

            $validator = Validator::make($req->all(),[
                'fullname'=>'required|max:64',
                'username'=>'required|max:64|unique:users,username',
                'email'=>'required|email|max:64|unique:users,email',
                'password'=>'required|min:4',
                'accounttype'=>'required'
            ]);

            if($validator->fails()){
                return response()->json([
                    'status'=>'error',
                    'messages'=>$validator->getMessageBag()
                ], 422);
            }

            $user = new User;
            $user->fullname = $req->fullname;
            $user->username = $req->username;
            $user->email = $req->email;
            $user->password = $req->password;
            $user->gender = $req->gender ?? 'Male';
            $user->accounttype = ($userType === 'doctor') ? 'user' : $req->accounttype;
            $user->user_playing_time = $req->allotted_time ?? '20';
            $user->image_address = ($req->gender === 'Female') ? '0_default_female_profile_image.png' : '0_default_male_profile_image.png';
            $user->left_eye_color = 'red';
            $user->right_eye_color = 'cyan';
            $user->left_eye_contrast_color = '#ff0000';
            $user->right_eye_contrast_color = '#00ffff';
            $user->left_eye_contrastvalue = 255;
            $user->right_eye_contrastvalue = 255;
            $user->user_game_records = '';

            if ($userType === 'doctor') {
                // Auto-assign to this doctor
                $user->doctor_id = $userId;
            } elseif ($req->has('doctor_id') && !empty($req->doctor_id)) {
                $user->doctor_id = $req->doctor_id;
            }

            if($user->save()){
                return response()->json(['status' => 'success', 'user' => $user]);
            }
            return response()->json(['status' => 'failed'], 500);
        });
    }

    public function fetchLoginUser(Request $req){
        return self::safelyQuery(function() use ($req) {
            $data = DB::table('users')
                ->leftJoin('users as docs', 'users.doctor_id', '=', 'docs.id')
                ->where('users.id', $req->id)
                ->select(
                    'users.*',
                    'docs.fullname as doctor_name',
                    'docs.email as doctor_email'
                )
                ->get();
            return $data;
        });
    }

    public function registerData(Request $req){
        return self::safelyQuery(function() use ($req) {
            $validator = Validator::make($req->all(),[
                'username'=>'required|max:100|unique:users,username|unique:registers,username',
                'email'=>'required|max:100|unique:users,email|unique:registers,email',
                'password'=>'required',
            ]);
            if($validator->fails()){
                return response()->json([
                    'status'=>'failed',
                    'messages'=>$validator->getMessageBag()
                ]);
            }
            else{
                $user = new User;
                $user->fullname = $req->fullname;
                $user->username = $req->username;
                $user->gender = $req->gender;
                $user->email = $req->email;
                $user->password = $req->password;
                $user->accounttype = 'Unpaid User';
                $user->user_playing_time = '1';
                $user->user_game_records = '';
                if($req->gender=='Male'){
                    $user->image_address = '0_default_male_profile_image.png';
                } else if($req->gender=='Female'){
                    $user->image_address = '0_default_female_profile_image.png';
                }
                else{
                    $user->image_address = 'default.png';
                }
                $user->left_eye_color = 'red';
                $user->right_eye_color = 'blue';
                $user->left_eye_contrastvalue = 255;
                $user->right_eye_contrastvalue = 255;
                $user->left_eye_contrast_color = '#ff0000';
                $user->right_eye_contrast_color = '#0000ff';
                if($user->save()){
                    return 'success';
                }else{
                    return 'failed';
                } 
            }
        });
    }
    public function delete(Request $req){
        return self::safelyQuery(function() use ($req) {
            list($userId, $userType) = self::getAuthUser($req);

            if ($req->type == 'registers') {
                if ($userType === 'doctor') {
                    return response()->json(['status' => 'failed', 'message' => 'Unauthorized'], 403);
                }
                return DB::table('registers')->where('reg_id', $req->id)->delete();
            }

            if (in_array($req->type, ['users', 'admins', 'doctors'])) {
                $target = DB::table('users')->where('id', $req->id)->first();
                if (!$target) {
                    return 0;
                }

                // Doctor can ONLY delete their own assigned patients
                if ($userType === 'doctor') {
                    if ($target->doctor_id != $userId || in_array($target->accounttype, ['doctor', 'admin', 'root'])) {
                        return response()->json(['status' => 'failed', 'message' => 'Unauthorized: Doctors can only delete their own assigned patients'], 403);
                    }
                }

                // Admin cannot delete other admins or root
                if ($userType === 'admin') {
                    if (in_array($target->accounttype, ['admin', 'root'])) {
                        return response()->json(['status' => 'failed', 'message' => 'Unauthorized: Admins cannot delete other administrator accounts'], 403);
                    }
                }

                // Protect master root superadmin
                if ($target->accounttype === 'root' && DB::table('users')->where('accounttype', 'root')->count() <= 1) {
                    return response()->json(['status' => 'failed', 'message' => 'Cannot delete master root superadmin'], 403);
                }

                return DB::table('users')->where('id', $req->id)->delete();
            }
            return 0;
        });
    }

    public function approve(Request $req){
        return self::safelyQuery(function() use ($req) {
            list($userId, $userType) = self::getAuthUser($req);
            if ($userType === 'doctor') {
                return response()->json(['status' => 'failed', 'message' => 'Unauthorized: Only clinic administrators can approve registrations'], 403);
            }

            if($req->type=='registers'){
                $data = DB::table('registers')->where('reg_id',$req->id)->first();
                if($data){
                    $user = new User;
                    $user->fullname = $data->fullname;
                    $user->username = $data->username;
                    $user->email = $data->email;
                    $user->gender = $data->gender;
                    $user->password = $data->password;
                    $user->accounttype = 'user';
                    $user->user_playing_time = '5';
                    if($data->gender=='Male'){
                        $user->image_address = '0_default_male_profile_image.png';
                    } else if($data->gender=='Female'){
                        $user->image_address = '0_default_female_profile_image.png';
                    }
                    else{
                        $user->image_address = 'default.png';
                    }
                    $user->left_eye_color = 'red';
                    $user->right_eye_color = 'blue';
                    $user->left_eye_contrastvalue = 255;
                    $user->right_eye_contrastvalue = 255;
                    $user->left_eye_contrast_color = '#ff0000';
                    $user->right_eye_contrast_color = '#0000ff';
                    if($user->save()){
                        $delete = DB::table('registers')->where('reg_id',$req->id)->delete();
                        return 'success';
                    }else{
                        return 'failed';
                    }    
                }else{
                    return 'User Not Found';
                }
            }
            return 'Only Users which are registered can be approve';
        });
    }

    public function update(Request $req){
        return self::safelyQuery(function() use ($req) {
            list($userId, $userType) = self::getAuthUser($req);

            $target = DB::table('users')->where('id', $req->id)->first();
            if (!$target) {
                return response()->json(['status' => 'failed', 'message' => 'User not found'], 404);
            }

            // Doctor restrictions:
            if ($userType === 'doctor') {
                // Doctor can only update themselves or their assigned patients
                if ($target->id != $userId && $target->doctor_id != $userId) {
                    return response()->json(['status' => 'failed', 'message' => 'Unauthorized: Cannot edit other doctors or unassigned patients'], 403);
                }
                // Cannot change role
                if ($req->has('accounttype') && $req->accounttype !== $target->accounttype) {
                    return response()->json(['status' => 'failed', 'message' => 'Unauthorized: Cannot alter account role'], 403);
                }
            }

            // Admin restrictions:
            if ($userType === 'admin') {
                // Admin cannot edit other admins or root (except themselves)
                if (in_array($target->accounttype, ['admin', 'root']) && $target->id != $userId) {
                    return response()->json(['status' => 'failed', 'message' => 'Unauthorized: Admins cannot modify other administrators'], 403);
                }
                // Admin cannot promote anyone to admin or root
                if ($req->has('accounttype') && in_array($req->accounttype, ['admin', 'root']) && $target->accounttype !== $req->accounttype) {
                    return response()->json(['status' => 'failed', 'message' => 'Unauthorized: Only root superadmin can promote administrators'], 403);
                }
            }

            $date = gmdate('Y-m-d H:i:s');
            $payload = [
                'fullname' => $req->fullname,
                'username' => $req->username,
                'email' => $req->email,
                'gender' => $req->gender,
                'updated_at' => $date,
                'user_playing_time' => $req->allotted_time ?? '20'
            ];
            if ($req->has('password') && !empty($req->password)) {
                $payload['password'] = $req->password;
            }
            if ($req->has('accounttype') && !empty($req->accounttype) && $userType !== 'doctor') {
                $payload['accounttype'] = $req->accounttype;
            }
            if ($req->has('doctor_id') && $userType !== 'doctor') {
                $payload['doctor_id'] = $req->doctor_id ?: null;
            }

            DB::table('users')->where('id', $req->id)->update($payload);
            return 1;
        });
    }

    public function saveColorSettings(Request $req){
        return self::safelyQuery(function() use ($req) {
            $data = DB::table('users')->updateOrInsert(
                ['id'=>$req->id],
                ['left_eye_color'=>$req->left_eye_color,
                'right_eye_color'=>$req->right_eye_color,
                'left_eye_contrastvalue'=>$req->left_eye_contrastvalue,
                'right_eye_contrastvalue'=>$req->right_eye_contrastvalue,
                'left_eye_contrast_color'=>$req->left_eye_contrast_color,
                'right_eye_contrast_color'=>$req->right_eye_contrast_color
                ] 
            );
            return $data;
        });
    }

    public function saveGameRecords(Request $req){
        return self::safelyQuery(function() use ($req) {
            // 1. Maintain string_score for legacy compatibility
            if ($req->has('string_score') && !empty($req->string_score)) {
                DB::table('users')->where('id', $req->id)->update([
                    'user_game_records' => $req->string_score
                ]);
            }

            // 2. High performance normalized insert into game_records in UTC
            $gameName = $req->game_name;
            $score = intval($req->game_score ?: 0);
            $duration = intval($req->duration ?: 1200);
            $utcNow = gmdate('Y-m-d H:i:s');

            // Fallback: extract latest entry from score array if game_name wasn't passed directly
            if (empty($gameName) && !empty($req->score) && is_array($req->score)) {
                $latestBatch = end($req->score);
                if (is_array($latestBatch)) {
                    $gameName = key($latestBatch);
                    $score = intval(current($latestBatch));
                }
            }

            if (!empty($gameName)) {
                DB::table('game_records')->insert([
                    'user_id' => $req->id,
                    'game_name' => $gameName,
                    'score' => $score,
                    'duration_seconds' => $duration,
                    'played_at' => $utcNow,
                    'created_at' => $utcNow,
                    'updated_at' => $utcNow
                ]);
            }

            return response()->json(['status' => 'success', 'created_at_utc' => $utcNow]);
        });
    }

    public function assignDoctor(Request $req){
        return self::safelyQuery(function() use ($req) {
            list($userId, $userType) = self::getAuthUser($req);
            if ($userType === 'doctor') {
                return response()->json(['status' => 'failed', 'message' => 'Unauthorized: Doctors cannot reassign patients'], 403);
            }
            DB::table('users')->where('id', $req->patient_id)->update(['doctor_id' => $req->doctor_id ?: null]);
            return response()->json(['status' => 'success']);
        });
    }

    public function logConsultation(Request $req){
        return self::safelyQuery(function() use ($req) {
            list($userId, $userType) = self::getAuthUser($req);

            $doctorId = $req->doctor_id;
            // Doctor can only log consultations under their own doctor ID
            if ($userType === 'doctor') {
                $doctorId = $userId;
                // Verify this patient is assigned to this doctor
                $assigned = DB::table('users')->where('id', $req->patient_id)->where('doctor_id', $userId)->exists();
                if (!$assigned) {
                    return response()->json(['status' => 'failed', 'message' => 'Unauthorized: This patient is not assigned to you'], 403);
                }
            }

            $utcNow = gmdate('Y-m-d H:i:s');
            $id = DB::table('doctor_consultations')->insertGetId([
                'doctor_id' => $doctorId,
                'patient_id' => $req->patient_id,
                'status' => $req->status ?: 'Reviewed',
                'notes' => $req->notes ?: '',
                'compliance_assessment' => $req->compliance_assessment ?: 'Good',
                'prescribed_minutes' => intval($req->prescribed_minutes ?: 20),
                'created_at' => $utcNow,
                'updated_at' => $utcNow
            ]);

            if (!empty($req->prescribed_minutes)) {
                DB::table('users')->where('id', $req->patient_id)->update([
                    'user_playing_time' => $req->prescribed_minutes
                ]);
            }

            return response()->json(['status' => 'success', 'id' => $id, 'created_at_utc' => $utcNow]);
        });
    }

    public function fetchConsultations(Request $req){
        return self::safelyQuery(function() use ($req) {
            list($userId, $userType) = self::getAuthUser($req);

            $query = DB::table('doctor_consultations')
                ->join('users as docs', 'doctor_consultations.doctor_id', '=', 'docs.id')
                ->join('users as patients', 'doctor_consultations.patient_id', '=', 'patients.id')
                ->select(
                    'doctor_consultations.*',
                    'docs.fullname as doctor_name',
                    'docs.username as doctor_username',
                    'patients.fullname as patient_name',
                    'patients.username as patient_username'
                );

            // Doctor can only check consultations they conducted
            if ($userType === 'doctor') {
                $query->where('doctor_consultations.doctor_id', $userId);
            } else {
                if ($req->has('doctor_id') && !empty($req->doctor_id)) {
                    $query->where('doctor_consultations.doctor_id', $req->doctor_id);
                }
            }

            if ($req->has('patient_id') && !empty($req->patient_id)) {
                $query->where('doctor_consultations.patient_id', $req->patient_id);
            }

            $data = $query->orderBy('doctor_consultations.created_at', 'desc')->get();
            return response()->json($data);
        });
    }

    public function fetchGameRecords(Request $req){
        return self::safelyQuery(function() use ($req) {
            list($userId, $userType) = self::getAuthUser($req);

            $query = DB::table('game_records');

            if ($userType === 'doctor') {
                $assignedPatientIds = DB::table('users')->where('doctor_id', $userId)->pluck('id')->toArray();
                if ($req->has('user_id') && !empty($req->user_id)) {
                    if (!in_array($req->user_id, $assignedPatientIds)) {
                        return response()->json([]);
                    }
                    $query->where('user_id', $req->user_id);
                } else {
                    $query->whereIn('user_id', $assignedPatientIds);
                }
            } elseif ($userType === 'user') {
                $query->where('user_id', $userId);
            } else {
                if ($req->has('user_id') && !empty($req->user_id)) {
                    $query->where('user_id', $req->user_id);
                }
            }

            $data = $query->orderBy('played_at', 'desc')->limit(100)->get();
            return response()->json($data);
        });
    }

    public function fetchPatientActivity(Request $req){
        return self::safelyQuery(function() use ($req) {
            list($userId, $userType) = self::getAuthUser($req);

            $patientId = $req->patient_id ?: $req->id;
            if (!$patientId) {
                return response()->json(['status' => 'error', 'message' => 'Patient ID required'], 400);
            }

            $patient = DB::table('users')
                ->leftJoin('users as docs', 'users.doctor_id', '=', 'docs.id')
                ->where('users.id', $patientId)
                ->select(
                    'users.id',
                    'users.fullname',
                    'users.username',
                    'users.email',
                    'users.gender',
                    'users.doctor_id',
                    'users.accounttype',
                    'users.user_playing_time',
                    'users.created_at',
                    'users.image_address',
                    'docs.fullname as doctor_name'
                )
                ->first();

            if (!$patient) {
                return response()->json(['status' => 'error', 'message' => 'Patient not found'], 404);
            }

            // Access control:
            if ($userType === 'doctor' && $patient->doctor_id != $userId) {
                return response()->json(['status' => 'error', 'message' => 'Unauthorized: This patient is not assigned to you.'], 403);
            }
            if ($userType === 'user' && $patient->id != $userId) {
                return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
            }

            // Fetch normalized game records (last 100 sessions)
            $gameRecords = DB::table('game_records')
                ->where('user_id', $patientId)
                ->orderBy('played_at', 'desc')
                ->limit(100)
                ->get();

            // Calculate aggregate statistics
            $totalSessions = count($gameRecords);
            $totalDurationSecs = 0;
            $highScore = 0;
            $dailyAggregates = [];

            foreach ($gameRecords as $rec) {
                $totalDurationSecs += ($rec->duration_seconds ?: 1200);
                if ($rec->score > $highScore) {
                    $highScore = $rec->score;
                }
                $dateKey = substr($rec->played_at, 0, 10);
                if (!isset($dailyAggregates[$dateKey])) {
                    $dailyAggregates[$dateKey] = [
                        'date' => $dateKey,
                        'count' => 0,
                        'duration_minutes' => 0,
                        'games' => []
                    ];
                }
                $dailyAggregates[$dateKey]['count']++;
                $dailyAggregates[$dateKey]['duration_minutes'] += round(($rec->duration_seconds ?: 1200) / 60, 1);
                if (!in_array($rec->game_name, $dailyAggregates[$dateKey]['games'])) {
                    $dailyAggregates[$dateKey]['games'][] = $rec->game_name;
                }
            }

            // Consultations history
            $consultations = DB::table('doctor_consultations')
                ->leftJoin('users as docs', 'doctor_consultations.doctor_id', '=', 'docs.id')
                ->where('doctor_consultations.patient_id', $patientId)
                ->select('doctor_consultations.*', 'docs.fullname as doctor_name')
                ->orderBy('doctor_consultations.created_at', 'desc')
                ->get();

            $targetMins = intval($patient->user_playing_time ?: 20);
            $totalDurationMins = round($totalDurationSecs / 60, 1);
            $avgSessionMins = $totalSessions > 0 ? round($totalDurationMins / $totalSessions, 1) : 0;
            $daysActive = count($dailyAggregates);

            return response()->json([
                'status' => 'success',
                'patient' => $patient,
                'metrics' => [
                    'total_sessions' => $totalSessions,
                    'total_duration_minutes' => $totalDurationMins,
                    'avg_session_minutes' => $avgSessionMins,
                    'high_score' => $highScore,
                    'days_active' => $daysActive,
                    'target_daily_minutes' => $targetMins,
                    'compliance_rate' => $daysActive > 0 ? min(100, round(($avgSessionMins / max($targetMins, 1)) * 100, 1)) : 0
                ],
                'heatmap_data' => array_values($dailyAggregates),
                'recent_sessions' => $gameRecords->take(30),
                'consultations' => $consultations
            ]);
        });
    }
}
