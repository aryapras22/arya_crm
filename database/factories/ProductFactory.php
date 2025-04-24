<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;
    
    public function definition(): array
    {
        $speedOptions = ['10 Mbps', '25 Mbps', '50 Mbps', '100 Mbps', '250 Mbps', '500 Mbps', '1 Gbps'];
        
        return [
            'name' => fake()->words(3, true) . ' Package',
            'description' => fake()->sentence(10),
            'speed' => fake()->randomElement($speedOptions),
            'price' => fake()->randomFloat(2, 19.99, 199.99),
            'is_active' => fake()->boolean(80), // 80% chance of being active
            'created_at' => fake()->dateTimeBetween('-1 year', '-1 month'),
            'updated_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }
}