import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createNote = mutation({
  // args is the data sent from the frontend
  args: {
    note: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;
    // if (!userId) {
    //   throw new Error("Unauthorized");
    // }
    await ctx.db.insert("notesTable", {
      userId,
      note: args.note,
    });
  },
});

export const getNotes = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.query("notesTable").collect();
  },
});
