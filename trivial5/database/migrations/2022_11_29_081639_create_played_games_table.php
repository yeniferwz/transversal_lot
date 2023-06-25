<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('played_games', function (Blueprint $table) {
            $table->bigInteger('idUser')->unsigned();
            $table->bigInteger('idGame')->unsigned();
            $table->string('date');
            $table->bigInteger('score');
            $table->foreign('idUser')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('idGame')->references('id')->on('games')->onDelete('cascade');
            $table->primary(['idUser', 'idGame'])->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('played_games');
    }
};
