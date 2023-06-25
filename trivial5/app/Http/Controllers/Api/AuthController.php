<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;
use \stdClass;

class AuthController extends Controller
{
    public function register(Request $request){
        $request->validate([
            'name'=>'required',
            'email'=>'required|email|regex:/(.*)@(.*)\.(.*)/i|unique:users',
            'password'=>'required|confirmed'
        ]);

        if(User::where('email',$request->email)->exists()){
            $value = 0;
            $message = "This account has already been registered";
        }else{
            $user = new User();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = Hash::make($request->password);
            $user->save();
            $message = "success";
            $value = 1;
        }
        $ret = new stdClass();
        $ret->message = $message;
        $ret->value = $value;
        return json_encode($ret);
        // return response($user, Response::HTTP_CREATED);
    }

    public function login(Request $request){
        $credentials = $request->validate([
            'email'=>['required','email'],
            'password'=>['required']
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('token')->plainTextToken;
            $cookie = cookie('cookie_token', $token, 60 * 24);
            // return 1;
            return response(["token"=>$token,"message"=> "Credentials valid","user_id"=>$user->id,'username'=>$user->name], Response::HTTP_OK)->withoutCookie($cookie);
        } else {
            return response(["message"=> "Credentials not valid"],Response::HTTP_UNAUTHORIZED);
        } 
    }

    public function userProfile(Request $request){
        return response()->json([
            "message" => "user profile OK",
            "userData" => auth()->user()
        ], Response::HTTP_OK);
    }

    public function logout(){
        $cookie = Cookie::forget('cookie_token');
        return response(["message"=>"You have log out"], Response::HTTP_OK)->withCookie($cookie);
    }

    public function allUsers(){
        $users = User::all();
        return response()->json([
         "users" => $users
        ]);
    }
}
