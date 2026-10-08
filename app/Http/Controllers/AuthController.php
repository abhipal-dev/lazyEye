<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Register;
use App\Models\User;
class AuthController extends Controller
{   
    public function admin(Request $request){
        // $value = $request->session()->get('loggedInUserName');
         $user_id = $request->session()->get('loggedInUser');
        return view('adminPanel')->with('user_id',$user_id);
    }
    public function user_view(Request $request){
        $user_id = $request->session()->get('loggedInUser');
        $user_type = $request->session()->get('loggedInUserType');
        return view('userPanel')->with('user_id',$user_id)->with('user_type',$user_type);
    }

    public function report_view(Request $request){
        $user_id = $request->session()->get('loggedInUser');
        return view('userPanel')->with('user_id',$user_id);
    }

    public function game_panel_view(Request $request){
        $user_id = $request->session()->get('loggedInUser');
        return view('userPanel')->with('user_id',$user_id);
    }
    public function test_view(){
        // $value = $request->session()->get('loggedInUserName');
        // $value = $request->session()->get('loggedInUserName');
        return view('testPanel');
    }
    public function login(Request $request){
            
            $validator = Validator::make($request->all(),[
                'username'=>'required|max:100',
                'password'=>'required',
            ]);
            if($validator->fails()){
                return response()->json([
                    'status'=>400,
                    'messages'=>$validator->getMessageBag()
                ]);
            }
                try {
                    // Ensure database schema and demo records exist
                    \App\Http\Controllers\UserController::ensureDatabaseReady();

                    $user = DB::table('users')->where('username', $request->username)->first();
                    if($user){
                        if($request->password === $user->password){
                            $request->session()->put('loggedInUser', $user->id);
                            $request->session()->put('loggedInUserName', $user->fullname);
                            $request->session()->put('loggedInUserType', $user->accounttype);
                            if(in_array($user->accounttype, ['admin', 'root', 'doctor'])){
                                $message = 'success admin';
                            }
                            else{
                                $message = 'success user';
                            }
                            return response()->json([
                                'status' => 200,
                                'messages' => $message
                            ]);
                        }else{
                            return response()->json([
                                'status' => 401,
                                'messages' => 'Incorrect password'
                            ]);
                        }
                    }else{
                        return response()->json([
                            'status' => 401,
                            'messages' => 'User Not Found'
                        ]);
                    }
                } catch (\Throwable $e) {
                    \Log::error('Login database error: ' . $e->getMessage());
                    return response()->json([
                        'status' => 500,
                        'messages' => 'Database Error: ' . $e->getMessage()
                    ]);
                }
            }
    }
    public function logout(){
        \Session::flush();
        \Auth::logout();
        return response()->json([
            'messages'=>'success'
        ]);
    }
    
    public function login_view(){
        if(session()->has('loggedInUser')){
            return redirect()->route('admin');
            // return view('adminPanel');
        }else{
            return view('welcome');
        }

    }
    public function register_view(){
        if(session()->has('loggedInUser')){
            return redirect()->route('admin');
            // return view('adminPanel');
        }else{
            return view('welcome');
        }
    }
}
