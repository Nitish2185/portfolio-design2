import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  download?: boolean;
  external?: boolean;
};

/** Square-edged button: an acid fill wipes up from the bottom on hover and the arrow turns. */
export function SlabButton({ href, children, className = "", download, external }: Props) {
  return (
    <a
      href={href}
      download={download}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={`group/slab relative inline-flex items-center gap-4 overflow-hidden border border-bone px-6 py-4 font-display text-sm font-bold uppercase transition-colors duration-500 ease-out-expo hover:text-ink ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 translate-y-full bg-acid transition-transform duration-500 ease-out-expo group-hover/slab:translate-y-0"
      />
      <span className="relative">{children}</span>
      <span
        aria-hidden
        className="relative inline-block transition-transform duration-500 ease-out-expo group-hover/slab:rotate-45"
      >
        ↗
      </span>
    </a>
  );
}
