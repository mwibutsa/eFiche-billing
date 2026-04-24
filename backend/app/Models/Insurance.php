<?php

namespace App\Models;

use Database\Factories\InsuranceFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Insurance extends Model
{
    /** @use HasFactory<InsuranceFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'code',
    ];

    /**
     * @return BelongsToMany<Facility, $this>
     */
    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class, 'facility_insurance')
            ->withPivot(['coverage_percentage', 'is_active'])
            ->withTimestamps();
    }
}
