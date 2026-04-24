<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('visit_id')->unique()->constrained('visits')->cascadeOnDelete();
            $table->string('transaction_ref')->unique();
            $table->decimal('total_amount', 12, 2);
            $table->decimal('insurance_amount', 12, 2)->default(0);
            $table->decimal('patient_amount', 12, 2);
            $table->string('status')->default('draft');
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
