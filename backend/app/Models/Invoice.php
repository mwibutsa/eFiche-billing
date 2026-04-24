<?php

namespace App\Models;

use App\Enums\InvoiceStatus;
use App\Enums\PaymentStatus;
use Database\Factories\InvoiceFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Invoice extends Model
{
    /** @use HasFactory<InvoiceFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'visit_id',
        'transaction_ref',
        'total_amount',
        'insurance_amount',
        'patient_amount',
        'status',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'total_amount' => 'decimal:2',
            'insurance_amount' => 'decimal:2',
            'patient_amount' => 'decimal:2',
            'status' => InvoiceStatus::class,
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Invoice $invoice): void {
            if (empty($invoice->transaction_ref)) {
                $invoice->transaction_ref = self::generateTransactionRef();
            }
        });
    }

    public static function generateTransactionRef(): string
    {
        return 'INV-'.now()->format('Ymd').'-'.strtoupper(Str::random(8));
    }

    /**
     * @return Attribute<string, never>
     */
    protected function remainingBalance(): Attribute
    {
        return Attribute::get(function (): string {
            $confirmedPayments = $this->payments()
                ->where('status', PaymentStatus::Confirmed)
                ->sum('amount');

            return number_format((float) $this->patient_amount - (float) $confirmedPayments, 2, '.', '');
        });
    }

    /**
     * @return Attribute<bool, never>
     */
    protected function isFullyPaid(): Attribute
    {
        return Attribute::get(fn (): bool => (float) $this->remaining_balance <= 0);
    }

    /**
     * @return BelongsTo<Visit, $this>
     */
    public function visit(): BelongsTo
    {
        return $this->belongsTo(Visit::class);
    }

    /**
     * @return HasMany<InvoiceItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    /**
     * @return HasMany<Payment, $this>
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
