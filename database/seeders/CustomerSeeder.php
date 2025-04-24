<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Project;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all approved projects
        $approvedProjects = Project::where('status', 'approved')->pluck('id');
        
        foreach ($approvedProjects as $projectId) {
            Customer::create([
                'project_id' => $projectId,
                'name' => fake()->company(),
                'address' => fake()->address(),
                'registration_date' => Carbon::now()->subDays(rand(1, 60)),
            ]);
        }
    }
}