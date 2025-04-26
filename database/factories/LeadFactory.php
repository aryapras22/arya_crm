<?php

namespace Database\Factories;

use App\Models\Lead;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadFactory extends Factory
{
    protected $model = Lead::class;

    public function definition(): array
    {
        $statuses = ['new', 'contacted', 'qualified', 'lost', 'converted'];
        
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'status' => fake()->randomElement($statuses),
            'created_at' => fake()->dateTimeBetween('-3 months', 'now'),
        ];
    }
    
    // State method for qualified leads
    public function qualified(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'qualified',
            ];
        });
    }
}