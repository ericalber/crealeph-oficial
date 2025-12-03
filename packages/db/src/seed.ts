import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./client.js";

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@crealeph.local" },
    update: {},
    create: {
      email: "admin@crealeph.local",
      name: "Admin",
      role: "admin",
      password
    }
  });

  console.log("Seed concluído");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

