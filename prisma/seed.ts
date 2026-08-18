import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@vip-move.online";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashed = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin",
      email: adminEmail,
      phone: "+966566311375",
      password: hashed,
      role: "ADMIN",
    },
  });

  const tiers = [
    {
      slug: "private",
      nameEn: "Private Stage",
      nameAr: "المرحلة الخاصة",
      minPassengers: 1,
      maxPassengers: 4,
      descriptionEn: "Sedan – 1 to 4 Passengers",
      descriptionAr: "سيدان – 1 إلى 4 ركاب",
    },
    {
      slug: "family",
      nameEn: "Family Stage",
      nameAr: "مرحلة العائلة",
      minPassengers: 5,
      maxPassengers: 6,
      descriptionEn: "SUV – Up to 6 Passengers",
      descriptionAr: "SUV – حتى 6 ركاب",
    },
    {
      slug: "group",
      nameEn: "Group Stage",
      nameAr: "مرحلة المجموعة",
      minPassengers: 7,
      maxPassengers: 7,
      descriptionEn: "Van – Up to 7 Passengers",
      descriptionAr: "فان – حتى 7 ركاب",
    },
  ];

  for (const tier of tiers) {
    await prisma.vehicleTier.upsert({
      where: { slug: tier.slug },
      update: tier,
      create: tier,
    });
  }

  const privateTier = await prisma.vehicleTier.findUnique({ where: { slug: "private" } });
  const familyTier = await prisma.vehicleTier.findUnique({ where: { slug: "family" } });

  if (privateTier) {
    await prisma.vehicle.upsert({
      where: { id: "bmw-sedan" },
      update: {},
      create: {
        id: "bmw-sedan",
        name: "BMW Sedan",
        model: "BMW 5 Series",
        vehicleTierId: privateTier.id,
      },
    });
  }

  if (familyTier) {
    await prisma.vehicle.upsert({
      where: { id: "cadillac-escalade" },
      update: {},
      create: {
        id: "cadillac-escalade",
        name: "Cadillac Escalade",
        model: "Escalade SUV",
        vehicleTierId: familyTier.id,
      },
    });
  }

  const drivers = [
    { name: "Ahmed Al-Rashid", phone: "+966501234567" },
    { name: "Mohammed Al-Dossary", phone: "+966507654321" },
  ];

  for (const driver of drivers) {
    const existing = await prisma.driver.findFirst({ where: { phone: driver.phone } });
    if (!existing) {
      await prisma.driver.create({ data: driver });
    }
  }

  console.log("Seed completed.");
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
