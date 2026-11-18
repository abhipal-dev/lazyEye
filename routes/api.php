<?php

use App\Http\Controllers\HealthCheckController;
use App\Http\Controllers\IrisAgentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/health', [HealthCheckController::class, 'check']);
Route::match(['get', 'post'], '/iris/chat', [IrisAgentController::class, 'chat']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
