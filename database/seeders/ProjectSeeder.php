<?php

namespace Database\Seeders;

use App\Models\Lead;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $leads = Lead::where('status', 'qualified')->take(20)->pluck('id');
        $salesUsers = User::where('role', 'sales')->pluck('id');
        $managerUsers = User::where('role', 'manager')->pluck('id');
        
        // Create some approved projects
        foreach ($leads->take(10) as $leadId) {
            Project::factory()->create([
                'lead_id' => $leadId,
                'sales_id' => $salesUsers->random(),
                'status' => 'approved',
                'approved_by' => $managerUsers->random(),
                'approved_at' => Carbon::now()->subDays(rand(1, 30)),
            ]);
        }
        
        // Create some pending projects
        foreach ($leads->skip(10)->take(7) as $leadId) {
            Project::factory()->create([
                'lead_id' => $leadId,
                'sales_id' => $salesUsers->random(),
                'status' => 'pending',
                'approved_by' => null,
                'approved_at' => null,
            ]);
        }
        
        // Create some rejected projects
        foreach ($leads->skip(17) as $leadId) {
            Project::factory()->create([
                'lead_id' => $leadId,
                'sales_id' => $salesUsers->random(),
                'status' => 'rejected',
                'approved_by' => $managerUsers->random(),
                'approved_at' => Carbon::now()->subDays(rand(1, 15)),
            ]);
        }
    }
}