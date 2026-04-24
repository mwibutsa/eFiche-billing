<?php

namespace App\Exceptions;

use Exception;

class InsufficientBalanceException extends Exception
{
    public function __construct(string $message = 'Overpayment not allowed: amount exceeds remaining balance.')
    {
        parent::__construct($message, 422);
    }
}
