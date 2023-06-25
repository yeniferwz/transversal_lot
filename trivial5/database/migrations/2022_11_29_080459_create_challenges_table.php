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
        Schema::create('challenges', function (Blueprint $table) {
            $table->bigInteger('idChallenger')->unsigned();
            $table->bigInteger('idChallenged')->unsigned();
            $table->bigInteger('idGame')->unsigned();
            $table->bigInteger('idWinner')->default(0);
            $table->string('date');
            // $table->boolean('isFinished')->default(0);
            $table->enum('status',['accepted', 'pending', 'rejected'])->default('pending');
            $table->bigInteger('scoreChallenger')->default(0);
            $table->bigInteger('scoreChallenged')->default(0);

            $table->primary(['idChallenger', 'idChallenged', 'idGame'])->index();
            $table->foreign('idChallenger')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('idChallenged')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('idGame')->references('id')->on('games')->onDelete('cascade');

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
        Schema::dropIfExists('challenges');
    }
};
