import type { Message } from "@db/schema";

export const notifyWebhook = async (message: Message) => {
  if (!process.env.WEBHOOK_URL || !process.env.WEBHOOK_TOKEN) {
    throw new Error(
      "WEBHOOK_URL and WEBHOOK_TOKEN must be set in the environment variables.",
    );
  }

  try {
    const response = await fetch(process.env.WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Token": process.env.WEBHOOK_TOKEN,
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Webhook returned ${response.status}: ${errorText}`);
    }

    return response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Webhook notification failed:", errorMessage);
    throw error; // Re-throw for caller to handle
  }
};
