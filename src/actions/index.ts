import { db } from "@db/index.ts";
import { messagesTable } from "@db/schema";
import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { sql } from "drizzle-orm";
import { sanitize } from "isomorphic-dompurify";

export const server = {
  sendMessage: defineAction({
    accept: "form",
    input: z
      .object({
        name: z.string(),
        link: z.string().optional(),
        source: z.string().optional(),
        message: z.string(),
      })
      .transform((v) => ({
        name: sanitize(v.name),
        link: v.link ? sanitize(v.link) : undefined,
        source: v.source ? sanitize(v.source) : undefined,
        message: sanitize(v.message),
      })),
    handler: async (input) => {
      const message = {
        ...input,
        date: new Date().toISOString(),
      };

      try {
        await db.insert(messagesTable).values(message);
        return { success: true };
      } catch (error) {
        console.error("Failed to insert message:", error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not save your message. Please try again.",
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

      console.log("Approved messages:", messages);
      return messages;
    },
  }),
};
