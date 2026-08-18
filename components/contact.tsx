"use client";

import React from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import SectionHeading from "./section-heading";
import SubmitBtn from "./submit-btn";
import { sendEmail } from "@/actions/sendEmail";
import { useSectionInView } from "@/lib/hooks";

const EMAIL = "mrityunjay.singh119@gmail.com";

export default function Contact() {
  const { ref } = useSectionInView("Contact", 0.3);

  return (
    <section
      ref={ref}
      id="contact"
      className="mx-auto w-full max-w-350 scroll-mt-28 px-5 py-24 sm:px-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-1 gap-3 lg:grid-cols-5"
      >
        <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 lg:col-span-2">
          <SectionHeading eyebrow="04 / Contact">Let&apos;s build something</SectionHeading>
          <p className="text-[0.94rem] leading-relaxed text-muted">
            Open to mobile roles and freelance builds. Tell me what you&apos;re making and I&apos;ll
            reply within a day.
          </p>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-6 inline-block font-mono text-[0.8rem] break-all text-accent underline-offset-4 hover:underline"
          >
            {EMAIL}
          </a>
        </div>

        <form
          className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-6 sm:p-8 lg:col-span-3"
          action={async (formData) => {
            const { error } = await sendEmail(formData);
            if (error) {
              toast.error(error);
              return;
            }
            toast.success("Sent — I'll get back to you soon.");
            (document.getElementById("contact-form") as HTMLFormElement | null)?.reset();
          }}
          id="contact-form"
        >
          <label className="label-mono text-dim" htmlFor="senderEmail">
            Your email
          </label>
          <input
            id="senderEmail"
            name="senderEmail"
            type="email"
            required
            maxLength={500}
            placeholder="you@company.com"
            className="rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm text-text outline-hidden transition placeholder:text-dim focus:border-accent/50"
          />

          <label className="label-mono mt-2 text-dim" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            maxLength={5000}
            rows={6}
            placeholder="What are you building?"
            className="resize-none rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm text-text outline-hidden transition placeholder:text-dim focus:border-accent/50"
          />

          <div className="mt-2">
            <SubmitBtn />
          </div>
        </form>
      </motion.div>
    </section>
  );
}
