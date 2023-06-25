<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use \stdClass;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::all();
        // $users->sortBy('total_score',SORT_REGULAR,true);
        $users = User::orderByRaw('CONVERT(total_score,SIGNED)desc')->get();
        return json_encode($users);
    }

    public function indexPerfil($id){
        $users = User::select('name','email','total_score')->where('id','=',$id)->get();
        return json_encode($users);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store2(Request $request)
    {
        $users = new User();
        
        if(User::where('email',$request->email)->exists()){
            $data = 0;
        }else{
            $users -> id = $request -> id;
            $users -> name = $request -> name;
            $users -> email = $request -> email;
            $users -> password = $request -> password;
            $users -> total_score = $request -> total_score;

            $users -> save();
            $data = 1;
        }

        $ret = new stdClass();
        $ret->data = $data;
        return json_encode($ret);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|regex:/(.*)@(.*)\.(.*)/i|unique:users',
        ]);

        if(!(User::where('email',$request->email)->exists())){
            $user = new User();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->save();
            $data = 1;
        }else{
            $data = 0;
        }

        $ret = new stdClass();
        $ret->data = $data;
        return json_encode($ret);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
