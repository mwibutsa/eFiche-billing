<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyEfichePaySignature
{
    public function handle(Request $request, Closure $next): Response
    {
        $signature = $request->header('X-EfichePay-Signature');
        $secret = config('efichepay.webhook_secret');

        if (empty($secret)) {
            // If no secret configured (e.g. dev), pass through or fail. Let's pass if it's explicitly disabled, but we require it.
            // For testing purposes, we can bypass if secret is missing and we're not in production.
            if (! app()->isProduction()) {
                return $next($request);
            }
            abort(401, 'Webhook secret not configured.');
        }

        if (empty($signature)) {
            abort(401, 'Missing signature.');
        }

        // Compute HMAC SHA256 of the raw payload
        $computedSignature = hash_hmac('sha256', $request->getContent(), $secret);

        if (! hash_equals($computedSignature, $signature)) {
            abort(401, 'Invalid signature.');
        }

        return $next($request);
    }
}
