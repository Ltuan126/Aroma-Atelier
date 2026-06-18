# 🌿 My Aroma Atelier

A **production-oriented fullstack e-commerce system** designed to simulate real-world architecture and engineering practices.
This project focuses on **scalability, clean architecture, and database-driven development**, going beyond a typical CRUD-based shop.

Built as a **portfolio project for internship applications**, with an emphasis on demonstrating **engineering thinking, not just implementation**.

---

## 🧱 Tech Stack

* **Frontend**: Next.js (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Backend**: Next.js Route Handlers
* **ORM**: Prisma
* **Database**: PostgreSQL (Docker local)
* **Version Control**: Git & GitHub

---

## 🏗️ Architecture Overview

### System Structure

* `/store` → Customer-facing storefront
* `/admin` → Admin management system
* `/auth` → Authentication flow

### Data Flow

Client → Server (Next.js) → Prisma ORM → PostgreSQL

### Key Design Decisions

* **App Router** for scalable routing & layout control
* **Prisma ORM** for type-safe database operations
* **Separation of concerns** between store and admin domains
* **Database-first approach** for backend design

---

## ⚡ Technical Highlights

* Type-safe database access using Prisma
* Modular folder structure for scalability
* Clean separation between business domains
* Prepared for Dockerized development environment
* Git workflow with structured commit history

---

## 📁 Project Structure

```
src/        → Main application logic
public/     → Static assets (images, fonts)
prisma/     → Database schema & migrations
scripts/    → Utility scripts
infra/      → Infrastructure setup
docs/       → Project documentation
```

---

## 🚀 Features

### 🛍️ Storefront

* Product listing with category filtering
* Dynamic product detail pages
* Guest cart (LocalStorage) with database sync on login
* Full checkout flow with stock validation
* Order history & tracking page

### 🛠️ Admin Panel

* Dashboard with real-time statistics
* Product management (CRUD)
* Order management with status lifecycle (PENDING → PROCESSING → SHIPPED → DELIVERED / CANCELLED)
* Role-based access control (RBAC)

### 🔐 Authentication

* User registration & login (NextAuth + Credentials)
* Role-based route protection (ADMIN / CUSTOMER)
* Guest cart → DB sync on authentication

### 🗄️ System

* Relational database design (User, Product, Category, Order, Cart)
* Prisma schema & migrations
* Seed scripts for initial data

---

## 🗄️ Database Design

Core entities:

* User
* Product
* Category
* Order
* OrderItem
* Cart

Focus on:

* Relationship modeling
* Data consistency
* Scalable schema design

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18.17+)
* PostgreSQL
* Docker (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/Ltuan126/Aroma-Atelier.git

# Install dependencies
npm install

# Setup database
npx prisma migrate dev

# Run development server
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🧪 Local Development

* Uses local PostgreSQL (Docker-ready)
* Prisma handles schema migrations
* Seed scripts for test data (upcoming)

---

## 🔮 Roadmap

* [x] Project structure & routing
* [x] Repository setup
* [x] Prisma schema & migrations
* [x] Seed initial data
* [x] Product listing from database
* [x] Admin CRUD system
* [x] Cart & checkout flow
* [x] Authentication & RBAC
* [x] Order tracking & management
* [ ] Customer management (Admin)
* [ ] Search & advanced filtering
* [ ] Payment integration
* [ ] Deployment (Vercel + managed DB)

---

## 🎯 Learning Focus

This project emphasizes:

* Fullstack architecture design
* Database modeling & relationships
* Clean code organization
* Data flow understanding
* Real-world project structure

---

## 📸 Future Improvements

* Add system architecture diagram
* Add UI screenshots
* Deploy live demo
* Integrate caching layer (Redis)
* Add logging & monitoring

---

## 📄 License

MIT License

---

## 📫 Contact

**Tuan Nguyen Le**
📧 [tuanlenguyen612@gmail.com](mailto:tuanlenguyen612@gmail.com)

GitHub: https://github.com/Ltuan126/Aroma-Atelier

---

## 👤 Author

Aspiring Fullstack Developer focused on building **production-ready systems** and improving **software engineering fundamentals**.