<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PlayedGame;
use App\Models\User;
use App\Models\Game;
use Illuminate\Support\Facades\DB;

class PlayedgameController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $diaActual = date('d/m/Y');

        $todayGames = DB::table('played_games')
            ->where('date', '=', $diaActual)
            ->get();
    }

    public function index_record($id)
    {
        $record = DB::table('played_games')
        ->distinct()
            ->join('games', function($join) 
            {
                $join->on('played_games.idGame', '=', 'games.id');
            })
        ->where('played_games.idUser','=',$id)
        ->orderBy('played_games.date','desc')
        ->orderBy('played_games.created_at','desc')
        ->limit(10)
        ->get();
        //devolver tambien por id la categoria i dificultat del juego
        // $recordDetailed = Game::select('category','difficulty')->where('id','=',PlayedGame::value('idGame'));

        return $record;
    }

    public function  index_dailyranking()
    {

        $diaActual = date('d/m/Y');

        $dailyGame = DB::table('games')
            ->where('type', 'game_of_day')
            ->where('date', '=', $diaActual)
            ->first();

        // $rankingDaily =
        $rankingDaily = DB::table('played_games')
                ->distinct()
                ->join('users', function($join)
                {
                    $join->on('played_games.idUser', '=', 'users.id');
                })
                ->where('idGame', '=', $dailyGame->id)
                ->limit(100)
                ->orderBy('score', 'desc')
                ->get();

                // $rankingDaily = DB::table('played_games')
                // ->distinct()
                // ->join('users', function($join)
                // {
                //     $join->on('played_games.idUser', '=', 'users.id');
                // })
                // ->where('idGame', '=', $dailyGame->id)
                // ->limit(100)->toSql();
        // $users = User::all();
        // // $users->sortBy('total_score',SORT_REGULAR,true);
        // $users = User::orderByRaw('CONVERT(total_score,SIGNED)desc')->get();
        return json_encode($rankingDaily);
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
    public function store(Request $request)
    {
        $playedGames = new PlayedGame();
        $playedGames -> idUser = $request -> idUser;
        $playedGames -> idGame = $request -> idGame;
        $playedGames -> date = $request -> date;
        $playedGames -> score = $request ->score;

        $playedGames -> save();
        $user = User::find($playedGames -> idUser);
        $user -> total_score +=  $playedGames -> score;

        $user -> save();

        return $playedGames -> idGame;

        penalizarJugador($idUser, $idGame);
    }

    public function update(Request $request){

        $updateScore = DB::table('played_games')
            ->where('idUser', '=', $request -> idUser)
            ->where('idGame', '=', $request -> idGame)
            ->update(['score' => $request -> score]);

        $user = User::find($request -> idUser);
        $user -> total_score +=  $request -> score;
        $user -> total_score +=  300;

        $user -> save();

        return $user -> id;
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
