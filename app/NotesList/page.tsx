'use client'

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function NotesList() {
  const notes = useQuery(api.notes.getNotes);
  if (!notes) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {notes.map((note) => {
        return <div key={note._id}>{note.note}</div>;
      })}
    </div>
  );
}
