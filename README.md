# My Aroma Atelier 🌿

Production-ready **fullstack e-commerce web application** for a luxury fragrance brand.  
This project is built as a **personal portfolio project** for internship applications.

---

## 🧱 Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM**
- **PostgreSQL (Docker local)**
- **Git & GitHub**

---

## 📁 Project Structure

```markdown
- **src/**: Contains the main application code.
- **public/**: Static assets like images and fonts.
- **prisma/**: Database schema and migrations.
- **scripts/**: Utility scripts for project management.
- **infra/**: Infrastructure as code files.
- **docs/**: Documentation related to the project.
```

---

## 🚀 Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- Docker (optional, for local database)

### Installation

1. Clone the repo
   ```bash
   git clone https://github.com/yourusername/my-aroma-atelier.git
   ```
2. Install NPM packages
   ```bash
   npm install
   ```
3. Set up the database
   ```bash
   npx prisma migrate dev
   ```
4. Start the development server
   ```bash
   npm run dev
   ```

---

## 🚀 Features (Current & Planned)

### ✅ Implemented

- Production-ready Next.js App Router structure
- Storefront routing (`/store`)
- Admin routing (`/admin`)
- Authentication routing (`/auth`)
- GitHub-ready project setup
- Clean commit history

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

## 🗄️ Database (Planned)

- **PostgreSQL**
- **Prisma ORM**

Core entities:
- User
- Product
- Category
- Order
- OrderItem
- Cart

## 🧪 Local Development

1️⃣ Install dependencies
```bash
npm install
```

2️⃣ Start development server
```bash
npm run dev
```

3️⃣ Open browser
```bash
http://localhost:3000
```

🐳 Database (Docker – upcoming)

PostgreSQL will be run locally using Docker for a production-like environment.

🎯 Project Goals

- Practice real-world fullstack architecture
- Apply clean folder structure & domain separation
- Design backend models
- Integrate database with frontend
- Use Git professionally
- Serve as a portfolio project for internship applications

📌 Roadmap

- Project scaffolding & routing
- GitHub repository setup
- Prisma schema & migrations
- Seed initial data
- Store product listing
- Admin product CRUD
- Cart & checkout
- Authentication & RBAC
- Deployment

---

## 📖 Documentation

For detailed documentation, please refer to the [docs](docs/) folder.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📫 Contact

Tuan Nguyen Le - [tuanlenguyen612@gmail.com](mailto:tuanlenguyen612@gmail.com)

Project Link: [https://github.com/Ltuan126/Aroma-Atelier](https://github.com/Ltuan126/Aroma-Atelier)

---

## 👤 Author

Tuan Nguyen Le 
Aspiring Fullstack Developer

📄 License

This project is for educational and portfolio purposes.