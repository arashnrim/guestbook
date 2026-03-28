import { db } from "@db/index";
import { messagesTable, type Message } from "@db/schema";
import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { sql } from "drizzle-orm";
import { notifyWebhook } from "./webhook";

export const server = {
  sendMessage: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().min(1).max(100),
      link: z.url().max(500).optional(),
      source: z.string().max(50).optional(),
      message: z.string().min(1).max(5000),
      potofhoney: z
        .string()
        .optional()
        .refine((val) => !val),
    }),
    handler: async (input) => {
      try {
        const { potofhoney, ...messageData } = input;
        await db.insert(messagesTable).values(messageData);

        try {
          await notifyWebhook(messageData as Message);
        } catch (webhookError) {
          console.warn("Webhook notification failed:", webhookError);
        }

        return { success: true };
      } catch (error) {
        if (error instanceof ActionError) {
          throw error;
        }

        console.error("Failed to insert message:", error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save message. Please try again.",
        });
      }
    },
  }),

  getMessages: defineAction({
    handler: async () => {
      const messages = await db
        .select()
        .from(messagesTable)
        .where(sql`${messagesTable.approved} = 1`);

      return messages;
    },
  }),
};
