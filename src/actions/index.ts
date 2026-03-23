import { db } from "@db/index";
import { messagesTable } from "@db/schema";
import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { sql } from "drizzle-orm";

export const server = {
  sendMessage: defineAction({
    accept: "form",
    input: z.object({
      name: z.string(),
      link: z.string().optional(),
      source: z.string().optional(),
      message: z.string(),
    }),
    handler: async (input) => {
      try {
        await db.insert(messagesTable).values(input);
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

      return messages;
    },
  }),
};
