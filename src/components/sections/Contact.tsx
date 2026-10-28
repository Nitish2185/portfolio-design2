"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site, socials } from "@/content/site";
import { Magnetic } from "@/components/ui/Magnetic";
import { RollText } from "@/components/ui/RollText";
import { SectionLabel } from "@/components/ui/SectionLabel";

const EASE = [0.76, 0, 0.24, 1] as const;

/** One letter that drops in on scroll and jumps when hovered. */
function BouncyLetter({ char, index }: { char: string; index: number }) {
  return (
    <motion.span
      className="inline-block origin-bottom"
      initial={{ y: "100%", rotate: 20, opacity: 0 }}
      whileInView={{ y: "0%", rotate: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ type: "spring", stiffness: 140, damping: 12, delay: index * 0.05 }}
      whileHover={{
        y: "-14%",
        rotate: index % 2 ? 8 : -8,
        color: "#cbff3c",
        transition: { type: "spring", stiffness: 500, damping: 10 },
      }}
    >
      {char === " " ? " " : char}
    </motion.span>
  );
}

function Field({ id, label, type = "text", textarea = false }: { id: string; label: string; type?: string; textarea?: boolean }) {
  const shared =
    "peer w-full resize-none border-b border-line bg-transparent pt-7 pb-3 text-xl outline-none placeholder:text-transparent";
  return (
    <div className="relative">
      {textarea ? (
        <textarea id={id} name={id} rows={4} placeholder=" " required className={shared} />
      ) : (
        <input id={id} name={id} type={type} placeholder=" " required className={shared} />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-0 left-0 text-sm text-smoke transition-all duration-300 ease-out-expo peer-placeholder-shown:top-7 peer-placeholder-shown:text-xl peer-focus:top-0 peer-focus:text-sm peer-focus:text-acid"
      >
        {label}
      </label>
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-acid transition-transform duration-500 ease-out-expo peer-focus:scale-x-100"
      />
    </div>
  );
}

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  // No backend needed: the form opens the visitor's email app with the message filled in
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Hello from ${data.get("name")}`);
    const body = encodeURIComponent(`${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`);
    setStatus("sending");
    window.setTimeout(() => {
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setStatus("done");
    }, 900);
  };

  const label = status === "idle" ? "Send message" : status === "sending" ? "Opening mail…" : "Thank you!";

  return (
    <section id="contact" className="container-x relative overflow-hidden py-28 md:py-40">
      <SectionLabel className="mb-10">Contact</SectionLabel>

      <h2
        aria-label="Let's talk"
        className="mb-16 font-display text-[19vw] leading-[0.85] font-black uppercase md:mb-24 md:text-[14vw]"
      >
        <span aria-hidden className="block whitespace-nowrap">
          {Array.from("Let's").map((c, i) => (
            <BouncyLetter key={i} char={c} index={i} />
          ))}
        </span>
        <span aria-hidden className="block whitespace-nowrap md:pl-[20vw]">
          {Array.from("talk").map((c, i) => (
            <BouncyLetter key={i} char={c} index={i + 5} />
          ))}
          <motion.span
            className="ml-[2vw] inline-block text-acid"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          >
            ✳
          </motion.span>
        </span>
      </h2>

      <div className="grid gap-16 md:grid-cols-12 md:gap-8">
        <div className="flex flex-col gap-12 md:col-span-5">
          <Magnetic strength={0.5} className="self-start">
            <a
              href={`mailto:${site.email}`}
              className="group/cta relative flex size-44 items-center justify-center overflow-hidden rounded-full bg-acid text-ink md:size-52"
            >
              <span className="absolute inset-0 translate-y-full rounded-full bg-bone transition-transform duration-700 ease-out-expo group-hover/cta:translate-y-0" />
              <span className="relative text-center font-display text-lg leading-tight font-bold uppercase">
                Get in
                <br />
                touch ↗
              </span>
            </a>
          </Magnetic>

          <div className="flex flex-col gap-2">
            <span className="label">Email</span>
            <button
              type="button"
              onClick={copyEmail}
              className="group/roll relative self-start text-left font-display text-2xl font-bold md:text-3xl"
            >
              <RollText text={site.email} />
              <AnimatePresence>
                {copied && (
                  <motion.span
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute -top-10 left-0 bg-acid px-3 py-1 text-xs text-ink"
                  >
                    Copied!
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <span className="text-sm text-smoke">Click to copy · {site.location}</span>
          </div>

          <ul className="flex flex-col border-t border-line">
            {socials.map((s) => (
              <li key={s.label} className="border-b border-line">
                <a href={s.href} className="group/roll flex items-center justify-between py-4 text-lg">
                  <RollText text={s.label} />
                  <span className="transition-transform duration-500 ease-out-expo group-hover/roll:rotate-45">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-10 md:col-span-6 md:col-start-7">
          <p className="text-lg text-smoke">Lorem ipsum dolor sit amet — tell me about your consectetur project.</p>
          <Field id="name" label="Your name" />
          <Field id="email" label="Email address" type="email" />
          <Field id="message" label="Message" textarea />
          <button
            type="submit"
            disabled={status === "sending"}
            className="group/slab relative flex items-center justify-between overflow-hidden border border-bone px-6 py-5 font-display text-sm font-bold uppercase transition-colors duration-500 ease-out-expo hover:text-ink disabled:opacity-70"
          >
            <span className="absolute inset-0 translate-y-full bg-acid transition-transform duration-500 ease-out-expo group-hover/slab:translate-y-0" />
            <span className="relative h-5 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={label}
                  className="block"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  {label}
                </motion.span>
              </AnimatePresence>
            </span>
            <motion.span
              className="relative"
              animate={status === "sending" ? { rotate: 360 } : { rotate: 0 }}
              transition={status === "sending" ? { repeat: Infinity, duration: 0.8, ease: "linear" } : {}}
            >
              {status === "done" ? "✓" : "→"}
            </motion.span>
          </button>
        </form>
      </div>
    </section>
  );
}
