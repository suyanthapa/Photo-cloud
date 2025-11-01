import { PrismaClient } from "@prisma/client";
import { redis } from "../lib/redis";

const prisma = new PrismaClient();

const STREAM = "notifications:stream";
const GROUP = "notif-group";
const CONSUMER = `consumer-${process.pid}`;

async function setupGroup() {
  try {
    //create the group if it doesn't exist
    await redis.xgroup("CREATE", STREAM, GROUP, "$", "MKSTREAM");
  } catch (err: any) {
    console.error("Error setting up consumer group:", err);
  }
}

async function processNotifications() {
  console.log("Worker started, waiting for notifications...");

  while (true) {
    //Wait for new messages --5 sec
    //“Hey Redis, check the stream for up to 10 new messages for my consumer group.
    //If nothing arrives, block and wait 5 seconds before trying again.”
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
            // Save to DB
            const notification = await prisma.notification.create({
              data: {
                userId: Number(data.userId),
                actorId: data.actorId ? Number(data.actorId) : null,
                type: data.type,
                title: data.title,
                body: data.body,
                data: data.data,
              },
            });

            //  Publish to Redis pub/sub channel
            await redis.publish(
              "notification:pub",
              JSON.stringify({ userId: data.userId, notification })
            );

            //  Mark message as processed
            await redis.xack(STREAM, GROUP, id);
          } catch (err) {
            console.error("❌ Failed to process notification:", err);
          }
        }
      }
    } catch (err) {
      console.error("Redis read error:", err);
    }
  }
}

(async function startWorker() {
  await setupGroup();
  await processNotifications();
})();
