import { convexToJson, v } from "convex/values";
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

import { RateLimiter, MINUTE, HOUR } from "@convex-dev/rate-limiter";
import { components, internal } from "./_generated/api";

const rateLimiter = new RateLimiter(components.rateLimiter, {
  createNote: { kind: "fixed window", rate: 1, period: MINUTE },
});

export const createNote = mutation({
  // args is the data sent from the frontend
  args: {
    note: v.string(),
  },
  handler: async (ctx, args) => {
    // const userId = await getAuthUserId(ctx);
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;
    // await rateLimiter.limit(ctx, "createNote", {
    //   key: identity.subject,
    //   throws: true,
    // });
    await ctx.db.insert("notesTable", {
      userId,
      note: args.note,
    });
    await ctx.scheduler.runAfter(0, internal.notes.createNoteFile, {
      note: args.note,
    });
  },
});

export const addUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .unique();

    if (existing) return;

    await ctx.db.insert("users", {
      clerkId: userId,
      email: identity.email!,
      name: identity.name ?? undefined,
    });
  },
});

// export const deleteNotes = internalMutation({
//   args: {},
//   handler: async (ctx, args) => {
//     const notes = await ctx.db.query("notesTable").collect();
//     await Promise.all(notes.map((note) => ctx.db.delete(note._id)));
//   },
// });

export const getNotes = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    return await ctx.db
      .query("notesTable")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

// File handling
export const createNoteFile = internalAction({
  args: {
    note: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.storage.store(new Blob([args.note]));
  },
});

// Deleting Notes
export const deleteNotes = mutation({
  args: {
    noteId: v.id("notesTable"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;
    const note = await ctx.db.get(args.noteId);

    if (!note || note.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(note._id);
  },
});
