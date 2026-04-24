<?php

namespace App\Exceptions;

use Exception;

class InvoiceAlreadyPaidException extends Exception
{
    public function __construct(string $message = 'Invoice is already fully paid.')
    {
        parent::__construct($message, 422);
    }
}
