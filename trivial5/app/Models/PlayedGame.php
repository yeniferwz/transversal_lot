<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Http\Models\Game;

class PlayedGame extends Model
{
    use HasFactory;
    public function game(){
        return $this->belongsTo(Game::class);
    }
}
