<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            LeadSeeder::class,
            ProductSeeder::class,
            ProjectSeeder::class,
            CustomerSeeder::class,
            CustomerServiceSeeder::class,
        ]);
    }
}