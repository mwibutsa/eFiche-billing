<?php

namespace Database\Factories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

class PatientFactory extends Factory
{
    protected $model = Patient::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'national_id' => $this->faker->unique()->numerify('################'),
            'insurance_id' => null,
            'insurance_number' => null,
        ];
    }
}
