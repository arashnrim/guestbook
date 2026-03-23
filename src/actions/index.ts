import { defineAction } from "astro:actions";
import { z } from "astro/zod";

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
      // TODO: Handle the form submission, e.g. save the message to a database
      console.log("Received message:", input);
      return "Hello, world!";
    },
  }),
};
