# My Aroma Atelier 🌿

Production-ready **fullstack e-commerce web application** for a luxury fragrance brand.  
This project is built as a **personal portfolio project** to demonstrate real-world
fullstack development skills for internship opportunities.

---

## ✨ Overview

**My Aroma Atelier** is a modern web application for selling premium fragrances
(candles, essential oils, perfumes) with a clear separation between:

- Customer storefront
- Authentication
- Admin dashboard
- Backend logic & database

The project follows **production-oriented architecture** instead of a demo-only setup.

---

## 🧱 Tech Stack

### Frontend
- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**

### Backend
- **Next.js Server Actions / Route Handlers**
- **Prisma ORM**
- **PostgreSQL**

### DevOps & Tooling
- **Docker (PostgreSQL local)**
- **Git & GitHub**
- **PowerShell scripts for scaffolding**
- **Production-ready folder structure**

---

## 📁 Project Structure

```text
src/app
├── store            # Customer-facing pages
│   ├── page.tsx
│   ├── products
│   ├── cart
│   └── checkout
│
├── admin            # Admin dashboard
│   ├── page.tsx
│   ├── products
│   └── orders
│
├── auth             # Authentication pages
│   ├── login
│   └── register
│
├── api              # Backend API routes
│
├── page.tsx         # Root redirect (/ → /store)
└── layout.tsx


Other important directories:

prisma/ # Database schema & seed
infra/ # Docker & infrastructure configs
scripts/ # Project scaffolding scripts

markdown
Copy code

---

## 🚀 Features (Current & Planned)

### ✅ Implemented
- Production-ready Next.js App Router structure
- Storefront routing (`/store`)
- Admin routing (`/admin`)
- Authentication routing (`/auth`)
- GitHub-ready project setup
- Clean commit history & roadmap

### 🛠️ In Progress
- Prisma schema & database migrations
- Product & category seed data
- Product listing from database
- Admin product management

### 🔮 Planned
- Cart & checkout flow
- Order management
- Authentication & RBAC (Admin / Customer)
- Deployment (Vercel + managed Postgres)

---

## 🗄️ Database (Planned)

- **PostgreSQL**
- **Prisma ORM**
- Core entities:
  - User
  - Product
  - Category
  - Order
  - OrderItem
  - Cart

---

## 🧪 Local Development

### 1️⃣ Install dependencies
```bash
npm install
2️⃣ Start development server
bash
Copy code
npm run dev
3️⃣ Open browser
arduino
Copy code
http://localhost:3000
🐳 Database (Docker – upcoming)
PostgreSQL will be run locally using Docker for a production-like environment.

🎯 Project Goals
Practice real-world fullstack architecture

Apply clean folder structure & domain separation

Demonstrate ability to:

Design backend models

Integrate database with frontend

Use Git professionally

Serve as a portfolio project for internship applications

📌 Roadmap
 Project scaffolding & routing

 GitHub repository setup

 Prisma schema & migrations

 Seed initial data

 Store product listing

 Admin product CRUD

 Cart & checkout

 Authentication & RBAC

 Deployment

👤 Author
Tuan Le
Aspiring Fullstack Developer

📄 License
This project is for educational and portfolio purposes.
