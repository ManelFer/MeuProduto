import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2] || "admin@loja.com";
  const password = process.argv[3] || "admin123";
  const name = process.argv[4] || "Administrador";
  const roleArg = (process.argv[5] || "").toUpperCase();
  const isAdminBootstrap = !process.argv[2] || email === "admin@loja.com";

  const hashedPassword = await bcrypt.hash(password, 10);

  const createRole = roleArg === "USER" ? "USER" : isAdminBootstrap ? "ADMIN" : "USER";
  const updateData = isAdminBootstrap ? { role: "ADMIN" as const } : {};

  const user = await prisma.user.upsert({
    where: { email },
    update: updateData,
    create: {
      email,
      password: hashedPassword,
      name,
      role: createRole,
    },
  });

  console.log("Usuário criado/atualizado:", {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
