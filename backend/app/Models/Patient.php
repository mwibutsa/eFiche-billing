<?php

namespace App\Models;

use Database\Factories\PatientFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends Model
{
    /** @use HasFactory<PatientFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'national_id',
        'insurance_id',
        'insurance_number',
    ];

    /**
     * @return BelongsTo<Insurance, $this>
     */
    public function insurance(): BelongsTo
    {
        return $this->belongsTo(Insurance::class);
    }

    /**
     * @return HasMany<Visit, $this>
     */
    public function visits(): HasMany
    {
        return $this->hasMany(Visit::class);
    }
}
