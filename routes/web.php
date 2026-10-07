<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\UploadImageController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/{any?}', function () {
//     return view('welcome');
// })->where('any','.*');

// Route::get('/{any?}', function () {
//     return view('welcome');
// })->where('any','.*');



// Route::get('/Login', function () {
//     return view('welcome');
// }); 

// Route::get('/Register', function () {
//     return view('welcome');
// }); 



Route::post('/Register_req', [UserController::class, 'registerData']);

Route::post('/Login_req', [AuthController::class, 'login']);

Route::post('/uploadImage', [UploadImageController::class, 'upload']);

Route::post('/SaveGameRecords', [UserController::class, 'saveGameRecords']);

Route::get('/fetchRegisters', [UserController::class, 'fetchRegisters']);

Route::post('/fetchLoginUser', [UserController::class, 'fetchLoginUser']);

Route::get('/fetchAdmins', [UserController::class, 'fetchAdmins']);

Route::get('/fetchDoctors', [UserController::class, 'fetchDoctors']);

Route::get('/fetchUsers', [UserController::class, 'fetchUsers']);

Route::get('/fetchDashboardStats', [UserController::class, 'fetchDashboardStats']);

Route::post('/createUser', [UserController::class, 'createUser']);
Route::post('/assignDoctor', [UserController::class, 'assignDoctor']);
Route::post('/logConsultation', [UserController::class, 'logConsultation']);
Route::get('/fetchConsultations', [UserController::class, 'fetchConsultations']);
Route::get('/fetchGameRecords', [UserController::class, 'fetchGameRecords']);

Route::post('/Approve', [UserController::class, 'approve']);

Route::post('/Delete', [UserController::class, 'delete']);

Route::post('/Logout', [AuthController::class, 'logout']);

Route::post('/Update', [UserController::class, 'update']);

Route::post('/saveColorSettings', [UserController::class, 'saveColorSettings']);

Route::group(['middleware' => ['loginCheck']], function () {

    Route::get('/Login_view', [AuthController::class, 'login_view'])->name('login');

    Route::get('/Register_view', [AuthController::class, 'register_view'])->name('register');

    Route::get('/admin', [AuthController::class, 'admin'])->name('admin');

    Route::get('/user', [AuthController::class, 'user_view'])->name('user');

    Route::get('/dashboard', function () {
        return view('adminPanel');
    });

    Route::get('/', function () {
        return view('welcome');
    })->name('home');

    Route::get('/game1snake', function () {
        return view('game1snake');
    })->name('game1');

    Route::get('/game2flappybird', function () {
        return view('game2flappybird');
    })->name('game2');

    Route::get('/game3ballcatcher', function () {
        return view('game3ballcatcher');
    })->name('game3');

    Route::get('/game4test', function () {
        return view('game4test');
    })->name('game4');

    Route::get('/game6bricksbreaker', function () {
        return view('game6bricksbreaker');
    })->name('game6');

    Route::get('/game5maze', function () {
        return view('game5maze');
    })->name('game5');

    Route::get('/game7test', function () {
        return view('game7test');
    })->name('game7');

    Route::get('/game8tetris', function () {
        return view('game8tetris');
    })->name('game8');

    Route::get('/game9bubbleshooter', function () {
        return view('game9bubbleshooter');
    })->name('game9');

    Route::get('/game10pingpong', function () {
        return view('game10pingpong');
    })->name('game10');

    Route::get('/game11stickyholds', function () {
        return view('game11stickyholds');
    })->name('game11');

    Route::get('/game12menja', function () {
        return view('game12menja');
    })->name('game12');

    Route::get('/test', function () {
        return view('test');
    })->name('test');

    Route::get('/testChild', function () {
        return view('frameTestChild');
    })->name('testChild');

    Route::get('/register', [RegisterController::class, 'index']);
    
    Route::post('/register', [RegisterController::class, 'register']);
});