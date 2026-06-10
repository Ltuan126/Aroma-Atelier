import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding database...");

  // Clear existing database records
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("🧹 Database cleared.");

  // Hash passwords
  const saltRounds = 10;
  const hashedAdminPassword = await bcrypt.hash("admin123", saltRounds);
  const hashedCustomerPassword = await bcrypt.hash("customer123", saltRounds);

  // Seed Users
  const admin = await prisma.user.create({
    data: {
      email: "admin@aroma.com",
      name: "Aroma Admin",
      password: hashedAdminPassword,
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "customer@gmail.com",
      name: "Tuan Nguyen",
      password: hashedCustomerPassword,
      role: "CUSTOMER",
    },
  });

  console.log("👤 Users seeded successfully.");

  // Seed Categories
  const catPerfume = await prisma.category.create({
    data: {
      name: "Nước hoa cao cấp",
      slug: "nuoc-hoa-cao-cap",
      description: "Các dòng nước hoa tinh tế chế tác thủ công lưu hương bền lâu.",
    },
  });

  const catOil = await prisma.category.create({
    data: {
      name: "Tinh dầu tự nhiên",
      slug: "tinh-dau-tu-nhien",
      description: "Tinh dầu thiên nhiên nguyên chất 100% giúp trị liệu tinh thần.",
    },
  });

  const catCandle = await prisma.category.create({
    data: {
      name: "Nến thơm nghệ thuật",
      slug: "nen-thom-nghe-thuat",
      description: "Nến thơm sáp tự nhiên tạo không gian ấm áp, thư thái.",
    },
  });

  console.log("🏷️ Categories seeded successfully.");

  // Seed Products
  const products = [
    {
      name: "Sương Mai - Eau de Parfum",
      slug: "suong-mai-eau-de-parfum",
      description: "Một mùi hương thanh khiết như sương sớm buổi ban mai, với nốt hương hoa nhài và cỏ ẩm.",
      price: 1250000,
      stock: 50,
      image: "p1",
      categoryId: catPerfume.id,
    },
    {
      name: "Gió Ngàn - Eau de Parfum",
      slug: "gio-ngan-eau-de-parfum",
      description: "Mùi hương ấm áp, hoang dã của gỗ thông, gỗ tuyết tùng và gió lạnh từ đại ngàn.",
      price: 1180000,
      stock: 40,
      image: "p4",
      categoryId: catPerfume.id,
    },
    {
      name: "Hoàng Hôn - Pure Essential Oil",
      slug: "hoang-hon-pure-essential-oil",
      description: "Hương thơm ngọt dịu của cam ngọt, hoàng đàn và một chút oải hương buổi chiều tà.",
      price: 450000,
      stock: 100,
      image: "p2",
      categoryId: catOil.id,
    },
    {
      name: "Nắng Sớm - Essential Oil",
      slug: "nang-som-essential-oil",
      description: "Tinh dầu chanh sả, bạc hà mang lại nguồn năng lượng sảng khoái ngày mới.",
      price: 420000,
      stock: 80,
      image: "p5",
      categoryId: catOil.id,
    },
    {
      name: "Đêm Đông - Scented Candle",
      slug: "dem-dong-scented-candle",
      description: "Sự kết hợp hoàn hảo giữa quế, đinh hương và vani ngọt ngào cho những đêm đông lạnh.",
      price: 380000,
      stock: 30,
      image: "p3",
      categoryId: catCandle.id,
    },
    {
      name: "Hương Thảo - Scented Candle",
      slug: "huong-thao-scented-candle",
      description: "Sáp đậu nành kết hợp tinh dầu hương thảo nguyên bản giúp tăng khả năng tập trung làm việc.",
      price: 350000,
      stock: 60,
      image: "p6",
      categoryId: catCandle.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("📦 Products seeded successfully.");

  // Seed initial Cart for the customer
  await prisma.cart.create({
    data: {
      userId: customer.id,
    },
  });

  console.log("🛒 Cart seeded successfully.");
  console.log("✨ Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
