import type { Message } from "@db/schema";

export const notifyWebhook = async (message: Message) => {
  if (!process.env.WEBHOOK_URL || !process.env.WEBHOOK_TOKEN) {
    throw new Error(
      "WEBHOOK_URL and WEBHOOK_TOKEN must be set in the environment variables.",
    );
  }

  await fetch(process.env.WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Token": process.env.WEBHOOK_TOKEN,
    },
    body: JSON.stringify(message),
  });
};
