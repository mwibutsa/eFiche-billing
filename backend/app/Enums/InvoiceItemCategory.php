<?php

namespace App\Enums;

enum InvoiceItemCategory: string
{
    case Consultation = 'consultation';
    case LabTest = 'lab_test';
    case Medication = 'medication';
    case Procedure = 'procedure';
}
