<?php

namespace App\Enums;

enum VisitStatus: string
{
    case Open = 'open';
    case Discharged = 'discharged';
    case Billed = 'billed';
}
