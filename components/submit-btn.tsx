"use client";

import React from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useFormStatus } from "react-dom";

export default function SubmitBtn() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group flex h-11 w-36 items-center justify-center gap-2 rounded-full bg-accent text-sm font-semibold text-ink outline-hidden transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
      ) : (
        <>
          Send
          <FaPaperPlane className="text-[0.7rem] opacity-70 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </>
      )}
    </button>
  );
}
