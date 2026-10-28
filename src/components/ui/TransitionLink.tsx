"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePageTransition } from "@/components/providers/TransitionProvider";

type Props = ComponentProps<typeof Link> & {
  /** Text shown on the curtain while the next page loads. */
  label?: string;
};

/** A Next.js Link that plays the page-transition curtain. */
export function TransitionLink({ href, label, onClick, children, ...rest }: Props) {
  const navigate = usePageTransition();

  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
          return;
        }
        e.preventDefault();
        navigate(typeof href === "string" ? href : (href.pathname ?? "/"), label);
      }}
    >
      {children}
    </Link>
  );
}
