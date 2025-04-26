<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'address' => fake()->address(),
            'registration_date' => fake()->dateTimeBetween('-1 year', 'now'),
            'status' => fake()->randomElement([
                Customer::STATUS_ACTIVE, 
                Customer::STATUS_INACTIVE,
                Customer::STATUS_SUSPENDED,
                Customer::STATUS_CANCELLED
            ]),
        ];
    }
    
    /**
     * Indicate that the customer is active.
     */
    public function active(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => Customer::STATUS_ACTIVE,
            ];
        });
    }
    
    /**
     * Indicate that the customer is inactive.
     */
    public function inactive(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => Customer::STATUS_INACTIVE,
            ];
        });
    }
}