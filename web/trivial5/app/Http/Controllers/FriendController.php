<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Friend;
use App\Models\User;
use \stdClass;
use Illuminate\Support\Facades\DB;

class FriendController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        $friendsRequested = DB::table('friends')
            ->distinct()
            ->leftJoin('users', function($join) 
            {
                $join->on('friends.idUserRequested', '=', 'users.id');
            })
            ->where('idUserRequest', '=', $id)
            ->where('status', '=', 'accepted')
            ->get();

        $friendsRequest = DB::table('friends')
            ->distinct()
            ->leftJoin('users', function($join) 
            {
                $join->on('friends.idUserRequest', '=', 'users.id');
            })
            ->where('idUserRequested', '=', $id)
            ->where('status', '=', 'accepted')
            ->get();

        $allFriends = [];
        
        for ($i=0; $i < count($friendsRequest); $i++) { 
            array_push($allFriends, $friendsRequest[$i]);
        }

        for ($i=0; $i < count($friendsRequested); $i++) { 
            array_push($allFriends, $friendsRequested[$i]);
        }
        
        if(count($allFriends) > 0) {
            return json_encode($allFriends);
        } 
        else {
            return json_encode('sin amigos');
        }
    }

    public function index_pending($idUser){
        //get the list of people who sent you friend request   
        //SELECT users.name FROM `users` LEFT JOIN `friends` ON users.id = friends.idUserRequest 
        //WHERE friends.idUserRequested =13 AND friends.status = 'pending';

        $listOfRequestsreceived = DB::table('users')
        ->distinct()
        ->leftJoin('friends', function($join) 
        {
            $join->on('users.id', '=', 'friends.idUserRequest');
        })
        ->where('idUserRequested', '=', $idUser)
        ->where('status', '=', 'pending')
        ->get();

        $requestedPeople = [];
        
        for ($i=0; $i < count($listOfRequestsreceived); $i++) { 
            array_push($requestedPeople, $listOfRequestsreceived[$i]);
        }
        
        $ret = new stdClass();
        
        if(count($requestedPeople) > 0) {
            return json_encode($requestedPeople);
        } 
        else {
            return json_encode('no existing requests');
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $friend = new Friend();
        $sent = 0;
        $message = "";
        //si existe email del usuario
        $requestedID = User::where('email',$request->email)->value('id');
        $if1 = (Friend::where('idUserRequested',$request->id)->exists()&&Friend::where('idUserRequest',$requestedID)->exists());
        $if2 = (Friend::where('idUserRequested',$requestedID)->exists()&&Friend::where('idUserRequest',$request -> id)->exists());
        $solicitudAMi = ((Friend::where('idUserRequested',$request->id)->value('idUserRequested')) == (Friend::where('idUserRequest',$requestedID)->value('idUserRequest')));
        if(User::where('email',$request->email)->exists()){
            error_log("entra if");
            if((!$if1)||(!$if2)||(!$solicitudAMi)){
                $friend -> idUserRequested = $requestedID;
                $friend -> idUserRequest = $request -> id;
                $friend -> save();
                $sent = 1;
                $message = "Request sent successfully";
            }elseif($solicitudAMi){
                $message = "Cannot sent the request to yourself";
            }else{
                $message = "You have already sent the request to this email";
            }
        }else{
            $message = "Email not exists";
        }
        
        $ret = new stdClass();
        $ret->data = $sent;
        $ret->message = $message;
        return json_encode($ret);
    }

    public function deleteFriend(Request $request)
    {
        $recordToDelete = DB::table('friends')
            ->where('idUserRequest', '=', $request -> idUserRequest)
            ->where('idUserRequested', '=', $request -> idUserRequested)
            ->delete();
        $message = "friend delete successfully"; 
        $ret = new stdClass();
        $ret->data = $message;
        return json_encode($ret);
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
    public function update(Request $request)
    {
        $changeRequestStatus = DB::table('friends')
            ->where('idUserRequest', '=', $request -> idUserRequest)
            ->where('idUserRequested', '=', $request -> idUserRequested)
            ->update(['status' => $request -> status]);
        
        return $changeRequestStatus;
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
