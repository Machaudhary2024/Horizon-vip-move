/**
 * Initialize job queue handlers on app startup
 * This ensures async operations (emails, notifications) are processed properly
 */

import { jobQueue } from "./job-queue";
import { sendEmail } from "./email";

/**
 * Initialize all job handlers
 * Call this once when the app starts
 */
export function initializeJobHandlers() {
  // Email job handler
  jobQueue.registerHandler("send-email", {
    process: async (data: { to: string; subject: string; html: string }) => {
      await sendEmail({
        to: data.to,
        subject: data.subject,
        html: data.html,
      });
    },
    maxAttempts: 3, // Retry up to 3 times
  });

  // Add more handlers as needed
  // jobQueue.registerHandler("send-notification", { ... });
  // jobQueue.registerHandler("cleanup", { ... });

  console.log("✓ Job queue handlers initialized");
}

/**
 * Initialize cache system
 * Call this once when the app starts
 */
export function initializeCache() {
  const cacheType = process.env.CACHE_TYPE || "memory";
  console.log(`✓ Cache system initialized (${cacheType})`);
}

/**
 * Get application health status
 */
export function getAppHealth() {
  return {
    jobQueue: jobQueue.getStats(),
    timestamp: new Date().toISOString(),
  };
}
