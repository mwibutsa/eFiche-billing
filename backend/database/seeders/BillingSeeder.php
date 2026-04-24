<?php

namespace Database\Seeders;

use App\Enums\InvoiceItemCategory;
use App\Enums\InvoiceStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Enums\VisitStatus;
use App\Models\Facility;
use App\Models\Insurance;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Patient;
use App\Models\Payment;
use App\Models\User;
use App\Models\Visit;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BillingSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Facilities
        $kigaliHospital = Facility::create([
            'name' => 'Kigali General Hospital',
            'code' => 'KGH-001',
            'address' => 'KN 5 Rd, Kigali',
            'phone' => '0788123456',
        ]);

        $ruralPost = Facility::create([
            'name' => 'Rural Health Post Alpha',
            'code' => 'RHP-001',
            'address' => 'Rwamagana',
            'phone' => '0788654321',
        ]);

        // 2. Create Insurances
        $mutuelle = Insurance::create(['name' => 'Mutuelle de Santé', 'code' => 'MUT']);
        $rssb = Insurance::create(['name' => 'RSSB Medical', 'code' => 'RSSB']);
        $mituelle = Insurance::create(['name' => 'UAP Insurance', 'code' => 'UAP']);

        // 3. Attach Insurances to Facilities
        $kigaliHospital->insurances()->attach($mutuelle->id, ['coverage_percentage' => 100]);
        $kigaliHospital->insurances()->attach($rssb->id, ['coverage_percentage' => 85]);
        $kigaliHospital->insurances()->attach($mituelle->id, ['coverage_percentage' => 100]);

        $ruralPost->insurances()->attach($mutuelle->id, ['coverage_percentage' => 100]);

        // 4. Create Cashier Users
        $cashier1 = User::create([
            'name' => 'Cashier Kigali',
            'email' => 'cashier.kigali@efiche.africa',
            'password' => Hash::make('password'),
            'facility_id' => $kigaliHospital->id,
            'role' => UserRole::Cashier->value,
        ]);
        $token1 = $cashier1->createToken('test-token')->plainTextToken;
        $this->command->info("Cashier Kigali Token: $token1");

        $cashier2 = User::create([
            'name' => 'Cashier Rural',
            'email' => 'cashier.rural@efiche.africa',
            'password' => Hash::make('password'),
            'facility_id' => $ruralPost->id,
            'role' => UserRole::Cashier->value,
        ]);
        $token2 = $cashier2->createToken('test-token')->plainTextToken;
        $this->command->info("Cashier Rural Token: $token2");

        // 5. Create Patients
        $patient1 = Patient::create([
            'name' => 'Jean Baptiste',
            'national_id' => '1199080000000001',
            'insurance_id' => $mutuelle->id,
            'insurance_number' => 'MUT-9908',
        ]);

        $patient2 = Patient::create([
            'name' => 'Alice Umutoni',
            'national_id' => '1198580000000002',
            'insurance_id' => $rssb->id,
            'insurance_number' => 'RSSB-9858',
        ]);

        $patient3 = Patient::create([
            'name' => 'John Doe', // No insurance
        ]);

        // 6. Create Visits
        // Visit 1: Open, ready to be billed
        $visit1 = Visit::create([
            'patient_id' => $patient1->id,
            'facility_id' => $kigaliHospital->id,
            'visited_at' => now()->subHours(2),
            'status' => VisitStatus::Open,
        ]);
        $this->command->info("Visit 1 (Open): {$visit1->id}");

        // Visit 2: Billed, partially paid
        $visit2 = Visit::create([
            'patient_id' => $patient2->id,
            'facility_id' => $kigaliHospital->id,
            'visited_at' => now()->subDays(1),
            'status' => VisitStatus::Billed,
        ]);
        $this->command->info("Visit 2 (Billed): {$visit2->id}");

        $invoice2 = Invoice::create([
            'visit_id' => $visit2->id,
            'transaction_ref' => Invoice::generateTransactionRef(),
            'total_amount' => 15000,
            'insurance_amount' => 0,
            'patient_amount' => 15000,
            'status' => InvoiceStatus::PartiallyPaid,
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice2->id,
            'description' => 'General Consultation',
            'category' => InvoiceItemCategory::Consultation,
            'quantity' => 1,
            'unit_price' => 5000,
            'total_price' => 5000,
        ]);

        InvoiceItem::create([
            'invoice_id' => $invoice2->id,
            'description' => 'Malaria Test',
            'category' => InvoiceItemCategory::LabTest,
            'quantity' => 1,
            'unit_price' => 10000,
            'total_price' => 10000,
        ]);

        Payment::create([
            'invoice_id' => $invoice2->id,
            'amount' => 5000,
            'method' => PaymentMethod::Cash,
            'status' => PaymentStatus::Confirmed,
            'cashier_id' => $cashier1->id,
            'confirmed_at' => now(),
        ]);
    }
}
