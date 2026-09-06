/**
 * Job Queue for async operations (emails, notifications, etc.)
 * Uses in-memory queue in development, can be upgraded to Bull/RabbitMQ in production
 */

export type JobType = "send-email" | "send-notification" | "cleanup" | string;

interface Job<T = unknown> {
  id: string;
  type: JobType;
  data: T;
  status: "pending" | "processing" | "completed" | "failed";
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  processedAt?: Date;
  error?: string;
}

interface JobHandler<T = unknown> {
  process: (data: T) => Promise<void>;
  maxAttempts?: number;
}

class JobQueue {
  private jobs: Map<string, Job> = new Map();
  private handlers: Map<JobType, JobHandler> = new Map();
  private isProcessing = false;
  private processingInterval: NodeJS.Timeout | null = null;

  /**
   * Register a job handler
   */
  registerHandler<T>(type: JobType, handler: JobHandler<T>): void {
    this.handlers.set(type, handler);
  }

  /**
   * Add job to queue
   */
  async addJob<T>(
    type: JobType,
    data: T,
    maxAttempts: number = 3
  ): Promise<string> {
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const job: Job<T> = {
      id: jobId,
      type,
      data,
      status: "pending",
      attempts: 0,
      maxAttempts,
      createdAt: new Date(),
    };

    this.jobs.set(jobId, job);

    // Start processing if not already running
    if (!this.isProcessing) {
      this.startProcessing();
    }

    return jobId;
  }

  /**
   * Get job status
   */
  getJob(jobId: string): Job | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Start processing jobs
   */
  private startProcessing(): void {
    if (this.isProcessing) return;
    this.isProcessing = true;

    this.processingInterval = setInterval(async () => {
      await this.processNextJob();
    }, 1000); // Check every second

    // Process immediately
    this.processNextJob();
  }

  /**
   * Stop processing jobs
   */
  stopProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    this.isProcessing = false;
  }

  /**
   * Process next pending job
   */
  private async processNextJob(): Promise<void> {
    // Find first pending job
    let jobToProcess: Job | null = null;

    for (const [_, job] of this.jobs) {
      if (job.status === "pending") {
        jobToProcess = job;
        break;
      }
    }

    if (!jobToProcess) return;

    const handler = this.handlers.get(jobToProcess.type);
    if (!handler) {
      jobToProcess.status = "failed";
      jobToProcess.error = `No handler registered for job type: ${jobToProcess.type}`;
      return;
    }

    jobToProcess.status = "processing";
    jobToProcess.attempts += 1;

    try {
      await handler.process(jobToProcess.data);
      jobToProcess.status = "completed";
      jobToProcess.processedAt = new Date();
      console.log(`✓ Job ${jobToProcess.id} completed`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (
        jobToProcess.attempts <
        (handler.maxAttempts || jobToProcess.maxAttempts)
      ) {
        // Retry
        jobToProcess.status = "pending";
        jobToProcess.error = errorMessage;
        console.warn(
          `⚠ Job ${jobToProcess.id} failed, retrying (attempt ${jobToProcess.attempts}/${handler.maxAttempts || jobToProcess.maxAttempts})`
        );
      } else {
        // Final failure
        jobToProcess.status = "failed";
        jobToProcess.error = errorMessage;
        console.error(
          `✗ Job ${jobToProcess.id} failed permanently: ${errorMessage}`
        );
      }
    }
  }

  /**
   * Get queue statistics
   */
  getStats(): {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  } {
    let pending = 0,
      processing = 0,
      completed = 0,
      failed = 0;

    for (const [_, job] of this.jobs) {
      if (job.status === "pending") pending++;
      else if (job.status === "processing") processing++;
      else if (job.status === "completed") completed++;
      else if (job.status === "failed") failed++;
    }

    return {
      total: this.jobs.size,
      pending,
      processing,
      completed,
      failed,
    };
  }

  /**
   * Clear completed jobs (cleanup)
   */
  clearCompleted(): void {
    for (const [jobId, job] of this.jobs) {
      if (job.status === "completed") {
        this.jobs.delete(jobId);
      }
    }
  }
}

// Global instance
export const jobQueue = new JobQueue();

// Auto-cleanup completed jobs every 5 minutes
setInterval(() => {
  jobQueue.clearCompleted();
}, 5 * 60 * 1000);
