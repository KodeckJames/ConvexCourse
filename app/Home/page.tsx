'use client';

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function HomePage() {

  const createNote=useMutation(api.notes.createNote)

  return (
    <div className="flex flex-col items-center">
      <h1 className=" text-4xl text-blue-500 font-extrabold">HomePage</h1>
      <form  onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const note = formData.get("note") as string;
        void createNote({ note });
        form.reset();
      }}>
        <input name="note" type="text" className=" rounded-xl border border-white p-2 mt-4 mr-4" />
        <button>Submit</button>
      </form>
    </div>
  );
}
