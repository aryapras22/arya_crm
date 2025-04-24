<?php

namespace Database\Seeders;

use App\Models\Lead;
use App\Models\User;
use Illuminate\Database\Seeder;

class LeadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::where('role', 'sales')->pluck('id');
        
        // Create leads for each sales person
        foreach ($users as $userId) {
            Lead::factory()->count(5)->create([
                'created_by' => $userId,
            ]);
        }
    }
}