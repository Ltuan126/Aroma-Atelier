# Aroma Atelier - Project Specification

Aroma Atelier is a premium, craft e-commerce web application specializing in natural perfumes, essential oils, and scented candles. The application is built with a modern web stack, featuring a responsive, aesthetic design, and robust data persistence.

## 1. Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: TailwindCSS
- **Database**: PostgreSQL (Docker-based for local development)
- **ORM**: Prisma 7 (using `@prisma/adapter-pg` driver adapter)
- **Authentication**: NextAuth.js (for Customer/Admin authentication and authorization)
- **Language**: TypeScript

---

## 2. Database Schema (Prisma)

The database schema supports the e-commerce lifecycle and user roles:

- **Enums**:
  - `Role`: `ADMIN` | `CUSTOMER`
  - `OrderStatus`: `PENDING` | `PROCESSING` | `SHIPPED` | `DELIVERED` | `CANCELLED`
- **Models**:
  - `User`: User profile details, role-based authorization (links to `Order`, `Cart`).
  - `Category`: Categories of craft scent products (`Nước hoa cao cấp`, `Tinh dầu tự nhiên`, `Nến thơm nghệ thuật`).
  - `Product`: Scent items, pricing, inventory tracking, slugs for SEO.
  - `Order` & `OrderItem`: Order logs for purchases.
  - `Cart` & `CartItem`: Persistent shopping carts for logged-in customers.

---

## 3. Web & API Endpoints Architecture

### A. Frontend Routes

- `/store` - Store homepage displaying core product lines, brand story, and featured products.
- `/products` - Shop page with category filter, price filter, sorting, and product list.
- `/products/[slug]` - Detailed view of a product (to be built).
- `/login` - Login page for accounts.
- `/register` - Customer signup.
- `/admin` - Admin dashboard displaying sales stats and product inventory.

### B. Backend API Routes (Planned)

- `GET /api/products` - Returns list of products, supports filtering (category, price) and sorting.
- `GET /api/categories` - Returns all categories.
- `POST /api/auth/[...nextauth]` - Handles credentials-based authentication and sessions.
- `GET /api/cart` / `POST /api/cart` - User cart synchronization.

---

## 4. Security & Authentication

- Password hashing using `bcrypt`.
- JWT-based session management through NextAuth.
- Route protection for admin pages `/admin/*` and cart/checkout functions.
