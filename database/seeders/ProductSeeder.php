<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create fixed internet packages
        $products = [
            [
                'name' => 'Basic Internet',
                'description' => 'Basic internet package for small households',
                'speed' => '10 Mbps',
                'price' => 29.99,
                'is_active' => true,
            ],
            [
                'name' => 'Standard Internet',
                'description' => 'Standard internet package for average households',
                'speed' => '50 Mbps',
                'price' => 49.99,
                'is_active' => true,
            ],
            [
                'name' => 'Premium Internet',
                'description' => 'High-speed internet for demanding users',
                'speed' => '100 Mbps',
                'price' => 69.99,
                'is_active' => true,
            ],
            [
                'name' => 'Ultra Internet',
                'description' => 'Ultra-fast fiber optic internet',
                'speed' => '300 Mbps',
                'price' => 89.99,
                'is_active' => true,
            ],
            [
                'name' => 'Business Internet',
                'description' => 'Reliable internet solution for businesses',
                'speed' => '500 Mbps',
                'price' => 119.99,
                'is_active' => true,
            ],
            [
                'name' => 'Legacy Package',
                'description' => 'Old package no longer offered to new customers',
                'speed' => '5 Mbps',
                'price' => 19.99,
                'is_active' => false,
            ],
        ];
        
        foreach ($products as $product) {
            Product::create($product);
        }
        
        // Create some additional random products
        Product::factory()->count(4)->create();
    }
}