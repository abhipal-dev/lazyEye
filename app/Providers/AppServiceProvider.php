<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        if (config('app.env') === 'production' || env('APP_ENV') === 'production' || str_contains(env('APP_URL', ''), 'https://') || request()->server('HTTP_X_FORWARDED_PROTO') === 'https') {
            URL::forceScheme('https');
        }

        try {
            \App\Http\Controllers\UserController::ensureDatabaseReady();
        } catch (\Throwable $e) {
            \Log::warning('AppServiceProvider auto-initialization deferred: ' . $e->getMessage());
        }
    }
}
