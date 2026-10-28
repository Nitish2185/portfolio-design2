import { Star } from "./Star";

/** Small heading that opens each section. */
export function SectionLabel({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Star className="size-3 text-acid" />
      <span className="label !text-bone">{children}</span>
      <span className="h-px w-16 bg-line" />
    </div>
  );
}
