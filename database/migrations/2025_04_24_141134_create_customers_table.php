<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained();
            $table->string('name');
            $table->string('status')->default('active');
            $table->text('address')->nullable();
            $table->date('registration_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
           
            DB::statement('ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_status_check');
            
            $table->dropColumn('status');
        });
    }
};