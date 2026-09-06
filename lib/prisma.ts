import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"], // Only log errors in production
    // Production optimizations
    ...(process.env.NODE_ENV === "production" && {
      errorFormat: "minimal", // Minimal error format for performance
    }),
  });

// Ensure singleton pattern in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

