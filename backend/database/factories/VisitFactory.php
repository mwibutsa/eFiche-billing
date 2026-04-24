<?php

namespace Database\Factories;

use App\Enums\VisitStatus;
use App\Models\Facility;
use App\Models\Patient;
use App\Models\Visit;
use Illuminate\Database\Eloquent\Factories\Factory;

class VisitFactory extends Factory
{
    protected $model = Visit::class;

    public function definition(): array
    {
        return [
            'patient_id' => Patient::factory(),
            'facility_id' => Facility::factory(),
            'visited_at' => now(),
            'status' => VisitStatus::Open,
        ];
    }
}
