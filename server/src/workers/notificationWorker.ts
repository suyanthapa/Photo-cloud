// Create: src/workers/start-notification-worker.ts
import { PrismaClient } from "@prisma/client";
import { redis } from "../lib/redis";
import { io } from "../server"; // Import your Socket.IO instance

const prisma = new PrismaClient();

const STREAM = "notifications:stream"; // ✅ Match your redis.ts
const GROUP = "notif-group";
const CONSUMER = `consumer-${process.pid}`;

async function setupGroup() {
  try {
    await redis.xgroup("CREATE", STREAM, GROUP, "$", "MKSTREAM");
    console.log("✅ Consumer group created successfully");
  } catch (err: any) {
    if (err.message.includes("BUSYGROUP")) {
      console.log("✅ Consumer group already exists");
    } else {
      console.error("❌ Error setting up consumer group:", err);
    }
  }
}

async function processNotifications() {
  console.log("🚀 Notification worker started, waiting for messages...");

  while (true) {
    try {
      const response = await (redis as any).xreadgroup(
        "GROUP",
        GROUP,
        CONSUMER,
        "BLOCK",
        5000,
        "COUNT",
        10,
        "STREAMS",
        STREAM,
        ">"
      );

      if (!response) continue;

      for (const [, messages] of response) {
        for (const [id, fields] of messages) {
          const data: Record<string, string> = {};
          for (let i = 0; i < fields.length; i += 2) {
            data[fields[i]] = fields[i + 1];
          }

          try {
            console.log(`📨 Processing notification for user ${data.userId}`);

            // ✅ Step 1: Save to database
            const notification = await prisma.notification.create({
              data: {
                userId: Number(data.userId),
                actorId: data.actorId ? Number(data.actorId) : null,
                type: data.type,
                title: data.title,
                body: data.body,
                data: data.data,
                isRead: false,
              },
              include: {
                actor: {
                  select: { id: true, username: true, email: true },
                },
              },
            });

            // ✅ Step 2: Publish to Redis pub/sub for real-time delivery
            await redis.publish(
              "notification:pub",
              JSON.stringify({
                userId: data.userId,
                notification: {
                  ...notification,
                  data: notification.data
                    ? JSON.parse(notification.data)
                    : null,
                },
              })
            );

            // ✅ Step 3: Update user's unread count in cache
            await redis.incr(`user:${data.userId}:unread_count`);

            // ✅ Step 4: Mark message as processed
            await redis.xack(STREAM, GROUP, id);

            console.log(
              `✅ Notification processed successfully for user ${data.userId}`
            );
          } catch (err) {
            console.error("❌ Failed to process notification:", err);
            // Don't acknowledge failed messages - they'll be retried
          }
        }
      }
    } catch (err) {
      console.error("❌ Redis read error:", err);
      // Wait a bit before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

// ✅ Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down notification worker...");
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
});

// ✅ Start the worker
(async function startWorker() {
  try {
    await setupGroup();
    await processNotifications();
  } catch (error) {
    console.error("❌ Worker startup failed:", error);
    process.exit(1);
  }
})();
