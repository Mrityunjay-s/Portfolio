import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-350 flex-col gap-3 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p className="label-mono text-dim">
          &copy; {new Date().getFullYear()} Mrityunjay Singh
        </p>
        <div className="flex gap-5">
          <a
            href="https://www.linkedin.com/in/mrityunjaysi/"
            target="_blank"
            rel="noreferrer"
            className="label-mono text-dim transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/Mrityunjaysingh-1"
            target="_blank"
            rel="noreferrer"
            className="label-mono text-dim transition-colors hover:text-accent"
          >
            GitHub
          </a>
          <a
            href="mailto:mrityunjay.singh119@gmail.com"
            className="label-mono text-dim transition-colors hover:text-accent"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
