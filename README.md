# eFiche Billing Module

Production-grade Facility Patient Billing Module built with Laravel 12 and Next.js 15. This module handles clinical service invoicing, multi-channel payment processing, and real-time financial tracking.

## 🚀 Quick Start (Docker)

To get the application running on a new machine with Docker installed:

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- [Git](https://git-scm.com/) installed.

### 2. Clone and Environment Setup
```bash
# Clone the repository
git clone https://github.com/mwibutsa/eFiche-billing.git
cd eFiche-billing

# Initialize environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### 3. Start Containers
```bash
# Build and start the orchestration (Backend, Frontend, Postgres, Redis)
docker compose up -d --build
```

### 4. Database Initialization
```bash
# Run migrations and seed the database with test patients and clinical visits
docker compose exec backend php artisan migrate --seed
```

### 5. Access the Application
- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000/api](http://localhost:8000/api)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🛠 Development Commands

### Running Tests
```bash
# Backend Tests (Pest/PHPUnit)
docker compose exec backend php artisan test

# Frontend Tests (Vitest)
docker compose exec frontend npm test
```

### Code Style & Linting
```bash
# Backend (Laravel Pint)
docker compose exec backend ./vendor/bin/pint

# Frontend (Prettier & ESLint)
docker compose exec frontend npm run lint
```

---

## 🏗 Key Architectural Choices

- **Transactional Integrity**: Uses PostgreSQL row-level locking (`FOR UPDATE`) in the `PaymentService` to prevent race conditions during concurrent payment processing.
- **Modern UI**: Built with a "Nexun-inspired" aesthetic (Healthcare Financial Cloud style) featuring a clean, flat design, light themes, and a highly responsive layout.
- **Polling & Webhooks**: Supports USSD/Mobile Money flows with a background polling mechanism in the frontend and a secure, idempotent webhook receiver in the backend.
- **Database Driven**: The dashboard metrics (Collection Rate, Total Billed, Pending Invoices) are calculated in real-time from actual database transactions.

---

## 📡 Webhook Simulation
To simulate a successful eFichePay digital payment:
```bash
curl -X POST http://localhost:8000/api/webhooks/efichepay \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "evt_sim_" + $(date +%s),
    "status": "PAYMENT_COMPLETE",
    "orderNumber": "PAY-20260424-XXXXXXXX",
    "amount": 500000
  }'
```

## 📄 Deliverables
The following artifacts are included in this repository:
- **DESIGN_DOCUMENT.md**: Technical architecture and data modeling.
- **Dockerfile / docker-compose.yml**: Full containerization setup.
- **Backend/Frontend Source**: PSR-12 and Airbnb style compliant code.
