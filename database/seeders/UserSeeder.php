<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Manager',
            'email' => 'manager@ptsmart.com',
            'password' => Hash::make('password'),
            'role' => 'manager',
        ]);
        
        // Create sales user
        User::create([
            'name' => 'Sales',
            'email' => 'sales@ptsmart.com',
            'password' => Hash::make('password'),
            'role' => 'sales',
        ]);
        
        // Create random users
        User::factory()->count(8)->create();
    }
}