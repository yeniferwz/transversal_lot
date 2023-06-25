<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        $games = Game::find($id);
        return $games->data;
    }

    public function index_jugar($id){
        $games = Game::find($id);
        return $games->data;
    }


    public function index_jugarDaily(){
        $diaActual = date('d/m/Y');

        $dailyGame = DB::table('games')
            ->where('type', 'game_of_day')
            ->where('date', '=', $diaActual)
            ->first();

        
        return $dailyGame;
       
    }

    public function comprobarDaily($idUser){

        $diaActual = date('d/m/Y');
        $buscarDailyJugada;
        $existe = true;

        $dailyGame = DB::table('games')
            ->where('type', 'game_of_day')
            ->where('date', '=', $diaActual)
            ->first();

        $buscarDailyJugada = DB::table('played_games')
            ->where('idUser', $idUser)
            ->where('idGame', '=', $dailyGame->id)
            ->exists();

        return json_encode($buscarDailyJugada); 
            
    }
    
    public function getDifficulty($id){
        $getDiffi='SELECT difficulty FROM challenges JOIN games ON challenges.idGame = games.id JOIN users ON challenges.idChallenger = users.id WHERE challenges.status = "pending" AND challenges.idChallenged = '.$id;
        // $pendingChallenges = DB::select('SELECT * FROM challenges JOIN games ON challenges.idGame = games.id JOIN users ON challenges.idChallenged = users.id WHERE challenges.status = "pending" AND challenges.idChallenged = ?',$id);
        $pendingChallenges = DB::select($getDiffi);
        return json_encode($pendingChallenges);
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
        $game = new Game();
        $game->category = $request->category;
        $game->type = $request->type;
        $game->difficulty = $request->difficulty;
        $game->date = $request->date;
        // $game->data = json_encode($request->data);
        $game->data = $request->data;

        $game->save();

        return $game->id;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
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
    public function update(Request $request, $id)
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
