<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Lead;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First, check what status values are allowed in the database
        $allowedStatuses = [];
        if (DB::connection()->getDriverName() === 'pgsql') {
            $checkConstraint = DB::select("
                SELECT pg_get_constraintdef(oid) as constraint_def
                FROM pg_constraint
                WHERE conname = 'projects_status_check'
            ");
            
            if (!empty($checkConstraint)) {
                $this->command->info("Found check constraint: " . $checkConstraint[0]->constraint_def);
                // This will extract allowed values from the constraint definition
                preg_match("/CHECK \(\(status = ANY \(ARRAY\[(.*)\]\)\)\)/", $checkConstraint[0]->constraint_def, $matches);
                if (isset($matches[1])) {
                    $allowedStatuses = array_map(function($item) {
                        return trim($item, "'");
                    }, explode(',', $matches[1]));
                    $this->command->info("Allowed statuses: " . implode(", ", $allowedStatuses));
                }
            }
        }
        
        // If we couldn't extract the statuses, use these defaults
        if (empty($allowedStatuses)) {
            $allowedStatuses = ['pending_approval', 'approved', 'rejected', 'in_progress'];
            $this->command->warn("Using default status values: " . implode(", ", $allowedStatuses));
        }
        
        // Map our logical statuses to database statuses
        $statusMapping = [
            'draft' => $allowedStatuses[0], // Assuming first status is for draft
            'pending_approval' => $allowedStatuses[0], // Or choose appropriate value
            'approved' => in_array('approved', $allowedStatuses) ? 'approved' : $allowedStatuses[1],
            'rejected' => in_array('rejected', $allowedStatuses) ? 'rejected' : $allowedStatuses[2],
        ];
        
        $this->command->info("Status mapping: " . json_encode($statusMapping));
        
        // Rest of your method remains similar, but use the mapped statuses
        $qualifiedLeads = Lead::where('status', 'qualified')->get();
        $salesUsers = User::where('role', 'sales')->pluck('id')->toArray();
        $managerUsers = User::where('role', 'manager')->pluck('id')->toArray();
        
        if (empty($salesUsers) || empty($managerUsers)) {
            $this->command->error('No sales or manager users found. Please seed users first.');
            return;
        }
        
        if ($qualifiedLeads->isEmpty()) {
            $this->command->error('No qualified leads found. Please seed leads first.');
            return;
        }
        
        $leadsCollection = $qualifiedLeads->shuffle();
        $leadCount = $leadsCollection->count();
        
        // Calculate how many projects of each status to create
        $draftCount = max(1, (int)($leadCount * 0.25));
        $pendingCount = max(1, (int)($leadCount * 0.35));
        $approvedCount = max(1, (int)($leadCount * 0.25));
        $rejectedCount = max(1, $leadCount - $draftCount - $pendingCount - $approvedCount);
        
        $this->command->info("Creating $draftCount draft projects with status: " . $statusMapping['draft']);
        $this->command->info("Creating $pendingCount pending_approval projects with status: " . $statusMapping['pending_approval']);
        $this->command->info("Creating $approvedCount approved projects with status: " . $statusMapping['approved']);
        $this->command->info("Creating $rejectedCount rejected projects with status: " . $statusMapping['rejected']);
        
        $index = 0;
        
        // Create draft projects using the mapped status value
        foreach ($leadsCollection->slice($index, $draftCount) as $lead) {
            $this->createProject($lead, $salesUsers, $statusMapping['draft']);
        }
        $index += $draftCount;
        
        // Create pending_approval projects using the mapped status value
        foreach ($leadsCollection->slice($index, $pendingCount) as $lead) {
            $this->createProject($lead, $salesUsers, $statusMapping['pending_approval']);
        }
        $index += $pendingCount;
        
        // Create approved projects using the mapped status value
        foreach ($leadsCollection->slice($index, $approvedCount) as $lead) {
            $project = $this->createProject($lead, $salesUsers, $statusMapping['approved'], $managerUsers);
            
            // Mark lead as converted
            $lead->update(['status' => 'converted']);
            
            // Create a customer for this project
            Customer::create([
                'project_id' => $project->id,
                'name' => $lead->name,
                'registration_date' => $project->approved_at,
            ]);
        }
        $index += $approvedCount;
        
        // Create rejected projects using the mapped status value
        foreach ($leadsCollection->slice($index, $rejectedCount) as $lead) {
            $this->createProject($lead, $salesUsers, $statusMapping['rejected'], $managerUsers);
        }
    }
    
    /**
     * Helper method to create a project with given parameters.
     */
    private function createProject($lead, $salesUsers, $status, $managerUsers = null)
    {
        $createdDate = Carbon::now()->subDays(rand(10, 60));
        $approvedDate = null;
        $approvedBy = null;
        
        if (in_array($status, ['approved', 'rejected'])) {
            $approvedDate = clone $createdDate;
            $approvedDate->addDays(rand(1, 10));
            $approvedBy = $managerUsers[array_rand($managerUsers)];
        }
        
        return Project::factory()->create([
            'lead_id' => $lead->id,
            'sales_id' => $salesUsers[array_rand($salesUsers)],
            'status' => $status,
            'approved_by' => $approvedBy,
            'approved_at' => $approvedDate,
            'created_at' => $createdDate,
            'updated_at' => $approvedDate ?? $createdDate,
        ]);
    }
}