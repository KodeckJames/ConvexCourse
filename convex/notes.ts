import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createNote = mutation({
  args: {
    note: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unaothrized");
    }

    await ctx.db.insert("notesTable", {
      userId,
      note: args.note,
    });
  },
});
