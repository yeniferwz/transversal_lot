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
        Schema::create('friends', function (Blueprint $table) {
            $table->bigInteger('idUserRequest')->unsigned();
            $table->bigInteger('idUserRequested')->unsigned();
            $table->enum('status',['accepted', 'pending', 'rejected'])->default('pending');

            $table->primary(['idUserRequest', 'idUserRequested'])->index();
            $table->foreign('idUserRequest')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('idUserRequested')->references('id')->on('users')->onDelete('cascade');
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
        Schema::dropIfExists('friends');
    }
};
