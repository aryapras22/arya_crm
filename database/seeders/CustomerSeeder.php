<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Project;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all existing customers
        $customers = Customer::all();
        
        if ($customers->isEmpty()) {
            $this->command->info('No customers found to update.');
            return;
        }
        
        // Update all existing customers with a random status, biased toward active
        foreach ($customers as $customer) {
            $statusOptions = [
                Customer::STATUS_ACTIVE => 70,
                Customer::STATUS_INACTIVE => 15,
                Customer::STATUS_SUSPENDED => 10,
                Customer::STATUS_CANCELLED => 5,
            ];
            
            $status = $this->getRandomWeightedElement($statusOptions);
            
            $customer->update([
                'status' => $status,
            ]);
        }
        
        $this->command->info('Updated status for ' . $customers->count() . ' customers.');
    }
    
    /**
     * Get random element with weighting.
     */
    private function getRandomWeightedElement(array $weightedValues)
    {
        $rand = mt_rand(1, (int) array_sum($weightedValues));
        
        foreach ($weightedValues as $key => $value) {
            $rand -= $value;
            if ($rand <= 0) {
                return $key;
            }
        }
    }
}