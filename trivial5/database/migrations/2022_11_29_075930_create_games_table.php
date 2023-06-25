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
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->enum('category',['arts_and_literature','film_and_tv','food_and_drink','general_knowledge',
            'geography','history','music','science','society_and_culture','sport_and_leisure']);
            $table->enum('type',['demo','game_of_day','normal_game']);
            $table->enum('difficulty',['easy','medium','hard']);
            $table->string('date');
            $table->json('data')->nullable();
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
        Schema::dropIfExists('games');
    }
};
