# eFiche Facility Patient Billing Module — Design Document

## 1. Overview
The eFiche Billing Module is a production-grade system designed to handle patient billing, insurance coverage, and multiple payment methods (Cash, Mobile Money) with high reliability and concurrency safety.

## 2. Architecture
The system follows a monorepo structure with:
- **Backend**: Laravel 12 (PHP 8.3)
- **Frontend**: Next.js 15 (React 19, Tailwind CSS v4)
- **Database**: PostgreSQL 17

### 2.1. Key Technical Features
- **Row-Level Locking**: Uses `SELECT ... FOR UPDATE` (Pessimistic Locking) in the `PaymentService` to prevent race conditions when multiple cashiers process payments for the same invoice simultaneously.
- **Atomic Idempotency**: Webhook handling for eFichePay uses a unique constraint on `event_id` in the `webhook_events` table combined with `firstOrCreate` to ensure that every event is processed exactly once, even if delivered multiple times.
- **Type Safety**: Full TypeScript integration in the frontend and native PHP 8.3 Enums/DTOs in the backend.
- **Asynchronous Processing**: Mobile Money payments are initiated as `pending` and confirmed via secure HMAC-signed webhooks.

## 3. Database Schema
### Core Tables:
- `facilities`: Health facilities (Hospitals, Health Posts).
- `insurances`: Insurance providers.
- `facility_insurance`: Pivot table defining which insurances are accepted by which facility and their coverage percentage.
- `patients`: Patient demographics and insurance policy info.
- `visits`: Tracks patient visits to facilities.
- `invoices`: Financial record for a visit.
- `invoice_items`: Individual billed items (Consultation, Meds, Lab, etc.).
- `payments`: Tracks transactions against an invoice.
- `webhook_events`: Idempotency log for eFichePay events.

## 4. API Endpoints
- `POST /api/visits/{visit}/invoices`: Generate an invoice for an open visit.
- `GET /api/invoices/{invoice}`: Fetch invoice details, items, and payment history.
- `POST /api/invoices/{invoice}/payments`: Process a payment (Immediate for Cash, Pending for MoMo).
- `POST /api/webhooks/efichepay`: Secure endpoint for eFichePay notifications.

## 5. Security
- **Authentication**: Laravel Sanctum (Stateful for Web, Token-based for API).
- **Authorization**: Role-based access control (RBAC) ensuring only cashiers can process payments.
- **Webhook Security**: HMAC SHA256 signature verification on all incoming eFichePay requests.

## 6. Frontend Interaction
- **React Query**: Used for state management, automatic refetching, and polling.
- **Polling**: The UI automatically polls the invoice status every 5 seconds if there are pending mobile money payments.
- **Responsive Design**: Mobile-first approach using Tailwind CSS.

---
*Created on 2026-04-24 for eFiche Billing Module Challenge.*
