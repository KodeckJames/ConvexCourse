"use client";

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

export default function NotesList() {
  const deleteNote = useMutation(api.notes.deleteNotes);
  const notes = useQuery(api.notes.getNotes);
  if (!notes) {
    return <div>Loading...</div>;
  }
  return (
    <div className="space-y-4 p-6">
      {notes.map((note) => (
        <div
          key={note._id}
          className="bg-yellow-300 rounded-lg p-6 text-black shadow-md flex flex-row justify-between font-bold text-lg items-center hover:shadow-lg transition-shadow"
        >
          {note.note}
          <button
            onClick={() => void deleteNote({ noteId: note._id })}
            className=" bg-red-600 cursor-pointer p-2 rounded-full "
          >
            Delete Note
          </button>
        </div>
      ))}
    </div>
  );
}
