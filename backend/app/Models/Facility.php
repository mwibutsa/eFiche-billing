<?php

namespace App\Models;

use Database\Factories\FacilityFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Facility extends Model
{
    /** @use HasFactory<FacilityFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'code',
        'address',
        'phone',
    ];

    /**
     * @return BelongsToMany<Insurance, $this>
     */
    public function insurances(): BelongsToMany
    {
        return $this->belongsToMany(Insurance::class, 'facility_insurance')
            ->withPivot(['coverage_percentage', 'is_active'])
            ->withTimestamps();
    }

    /**
     * @return HasMany<Visit, $this>
     */
    public function visits(): HasMany
    {
        return $this->hasMany(Visit::class);
    }

    /**
     * @return HasMany<User, $this>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
