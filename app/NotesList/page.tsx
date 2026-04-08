"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function NotesList() {
  const notes = useQuery(api.notes.getNotes);
  if (!notes) {
    return <div>Loading...</div>;
  }
  return (
    <div className="space-y-4 p-6">
      {notes.map((note) => (
        <div
          key={note._id}
          className="bg-yellow-300 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
        >
          {note.note}
        </div>
      ))}
    </div>
  );
}
