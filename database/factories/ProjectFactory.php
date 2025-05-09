<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;
    
    public function definition(): array
    {
        return [
            'notes' => fake()->paragraph(2),
            'created_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }
}