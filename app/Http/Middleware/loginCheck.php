<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class loginCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next){
        $type = $request->session()->get('loggedInUserType');
        $name = $request->session()->get('loggedInUser');
        $current_path = \Request::route()->getName();
        $request_path= $request->path();
        $value = $request->session()->get('key');
        // echo "<h3>Request Path : ".$request_path." | Current Path : ".$current_path."</h3>";
        // echo "<h3>loggedInUserType : ".$type." | name : ".$name."</h3>";
        
        // Restrict Admin to redirect to other Guest pages
        if(session()->has('loggedInUser')&& $type==='admin' && ($request_path === '/' || $request_path === 'Register_view' || $request_path === 'Login_view' )){
            return redirect()->route('admin');
        }
        if(session()->has('loggedInUser')&& $type!='admin' && ($request_path === '/' || $request_path === 'Register_view' || $request_path === 'Login_view'||$request_path === 'admin')){
            return redirect()->route('user');
        }

        // Restrict Guest to redirect to ADMIN Dashboard
        if(!session()->has('loggedInUser')&& ($request_path === 'admin')){
            return redirect()->route('login');
        }
        if(!session()->has('loggedInUser')&& ($request_path === 'user')){
            return redirect()->route('login');
        }       
        return $next($request);
    }
}
