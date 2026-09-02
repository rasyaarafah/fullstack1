import { prisma } from "../lib/prisma";

async function main() {
  // Create an Admin user in MySQL
  const admin = await prisma.user.upsert({
    where: { email: "admin" },
    update: {},
    create: {
      name: "School Admin",
     email: "admin",
      password: "password123",
      role: "ADMIN",
    },
  });

  // Create a Teacher user in MySQL
  const teacher = await prisma.user.upsert({
    where: {email: "teacher" },
    update: {},
    create: {
      name: "John Doe",
      email: "teacher",
      password: "password123",
      role: "TEACHER",
    },
  });

  console.log("Database seeded successfully!");
  console.log({ admin, teacher });
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