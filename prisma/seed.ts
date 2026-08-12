import { prisma } from "../lib/prisma";

async function main() {
  // Create an Admin user in MySQL
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      name: "School Admin",
      username: "admin",
      password: "password123",
      role: "ADMIN",
    },
  });

  // Create a Teacher user in MySQL
  const teacher = await prisma.user.upsert({
    where: { username: "teacher" },
    update: {},
    create: {
      name: "John Doe",
      username: "teacher",
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