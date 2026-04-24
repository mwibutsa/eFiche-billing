# eFiche Billing Module

Production-grade Facility Patient Billing Module built with Laravel 12 and Next.js 15.

## Quick Start (Docker)

1. Clone the repository.
2. Run the setup script (simulated):
   ```bash
   cp .env.example .env
   docker compose up -d
   ```
3. Seed the database:
   ```bash
   docker compose exec backend php artisan db:seed
   ```
4. Access the app:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000/api](http://localhost:8000/api)
   - API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Local Development

### Backend
```bash
cd backend
composer install
php artisan migrate --seed
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Testing

### Backend
```bash
cd backend
php artisan test
```
The test suite covers:
- Invoice creation logic and status transitions.
- Payment processing with balance validation.
- Webhook signature verification and idempotency.

### Frontend
```bash
cd frontend
npm test
```

## Key Implementation Details

- **Concurrency**: PostgreSQL row locking (`lockForUpdate`) ensures no double-payments or overpayments occur during concurrent cashier sessions.
- **Idempotency**: Webhook events are tracked by a unique `event_id` to prevent duplicate processing.
- **Real-time Updates**: The frontend polls for invoice completion when a Mobile Money payment is pending.

## Webhook Simulation
To simulate an eFichePay webhook:
```bash
curl -X POST http://localhost:8000/api/webhooks/efichepay \
  -H "Content-Type: application/json" \
  -H "X-EfichePay-Signature: <hmac-sha256-signature>" \
  -d '{
    "eventId": "evt_test_123",
    "status": "PAYMENT_COMPLETE",
    "orderNumber": "PAY-20260424-XXXXXXXX",
    "amount": 500000
  }'
```
*(Note: Signature verification can be bypassed in non-production environments by omitting the secret in .env)*
