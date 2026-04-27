# eFiche Billing System - Design Document

## 1. Project Overview

The **eFiche Billing System** is a facility-level medical billing module designed to streamline clinical financial operations. It integrates directly with patient visit records to generate invoices, manage multi-channel payments (Cash, Mobile Money, Bank, Insurance), and provide real-time financial analytics.

## 2. Core Architecture

The system follows a modern decoupled architecture:

- **Backend**: Laravel 11/12 API providing business logic, pessimistic locking for concurrent payments, and webhook handling for digital payments.
- **Frontend**: Next.js 15 (App Router) with Tailwind CSS, React Query for state synchronization, and Lucide React for iconography.
- **Database**: PostgreSQL with UUIDs for all primary keys to ensure global uniqueness and security.

## 3. Design Philosophy (Nexun Inspiration)

The user interface is inspired by [nexun.africa](https://nexun.africa/), prioritizing:

- **Clean Aesthetic**: A strictly light-themed, high-contrast UI using a slate and blue palette.
- **Modern Typography**: Large, bold headings with generous whitespace for readability in fast-paced medical environments.
- **Premium Components**: Custom-styled cards with large border radii (`rounded-[40px]`) and smooth transitions.
- **Database Integrity**: A "No Placeholder" policy where every metric and list item is fetched directly from the database, ensuring zero-trust data consistency.

## 4. Key Features

### 4.1 Automated Billing Queue

The dashboard provides a live feed of active patient visits fetched directly from the `visits` table. Visits are categorized by their status:

- **New Visit**: Awaiting clinical service entry and invoice generation.
- **Awaiting Payment**: Invoice generated, pending financial settlement.
- **Settled**: Fully paid visits ready for clinical completion.

### 4.2 Split-Billing & Insurance

The system automatically calculates the patient's liability based on their insurance provider:

- Fetches dynamic insurance coverage rules.
- Generates transparent invoice summaries showing Total Billed vs. Insurance Amount vs. Patient Due.

### 4.3 Secure Concurrent Payments

To prevent race conditions during multiple payment attempts (e.g., simultaneous mobile money and cash processing), the backend utilizes:

- **Database Transactions**: Wrapping all payment logic in `DB::beginTransaction()`.
- **Pessimistic Locking**: Using `lockForUpdate()` on the Invoice model to ensure serial processing of balance updates.

## 5. Technical Implementation

- **API Communication**: Centered around a unified `api.ts` Axios instance with interceptors for error handling.
- **State Management**: React Query (TanStack) ensures that the UI (Collection Rates, Queue Status) is always in sync with the backend without manual refreshes.
- **Styling**: Vanilla Tailwind CSS with a strict color token system (Slate for structure, Blue for primary actions, Emerald for success).

## 6. Verification & Compliance

- **Static Analysis**: 100% ESLint compliance in the frontend.
- **Unit Testing**: Backend services (InvoiceService, PaymentService) are covered by PHPUnit tests ensuring financial accuracy.
- **Security**: Routes are protected by Laravel Sanctum, with critical webhook endpoints protected by custom signature verification middleware.
