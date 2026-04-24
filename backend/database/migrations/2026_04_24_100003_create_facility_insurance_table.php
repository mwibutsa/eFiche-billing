<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facility_insurance', function (Blueprint $table) {
            $table->foreignUuid('facility_id')->constrained('facilities')->cascadeOnDelete();
            $table->foreignUuid('insurance_id')->constrained('insurances')->cascadeOnDelete();
            $table->decimal('coverage_percentage', 5, 2)->default(100.00);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['facility_id', 'insurance_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facility_insurance');
    }
};
