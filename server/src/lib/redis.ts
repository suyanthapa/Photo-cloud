import Redis from "ioredis";

export const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

export const redis = new Redis(REDIS_URL);

export async function pushNotificationToStream(payload: Record<string, any>) {
  const flat: string[] = [];
  for (const [k, v] of Object.entries(payload)) {
    flat.push(k, typeof v === "string" ? v : JSON.stringify(v));
  }
  return redis.xadd("notification:stream", "*", ...flat);
}

//Line : 7 -- payload is an object like { userId: 42, message: "Hi!", data: { foo: "bar" } }.

//Line : 8 -- It initializes an empty array flat that will hold the data in the format Redis expects (a flat list of alternating field, value pairs).

//Line 9: Object.entries(payload) takes an object and returns an array of arrays, where each inner array contains a [key, value] pair.
