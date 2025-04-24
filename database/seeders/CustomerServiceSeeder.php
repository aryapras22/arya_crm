<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\CustomerService;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class CustomerServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = Customer::all();
        $activeProducts = Product::where('is_active', true)->get();
        
        foreach ($customers as $customer) {
            // Each customer has 1-3 services
            $serviceCount = rand(1, 3);
            
            // Use a set of unique products for each customer
            $selectedProducts = $activeProducts->random($serviceCount);
            
            foreach ($selectedProducts as $product) {
                $startDate = Carbon::now()->subDays(rand(30, 365));
                
                // 70% of services have no end date (ongoing)
                $endDate = rand(1, 10) <= 7 ? null : $startDate->copy()->addYears(1);
                
                CustomerService::create([
                    'customer_id' => $customer->id,
                    'product_id' => $product->id,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ]);
            }
        }
    }
}