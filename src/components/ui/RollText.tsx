type Props = {
  text: string;
  className?: string;
};

/**
 * Letters roll up one after another on hover.
 * Each letter carries a copy of itself below (via text-shadow) that slides into view.
 * The parent needs the `group/roll` class.
 */
export function RollText({ text, className = "" }: Props) {
  return (
    <span aria-label={text} className={`relative inline-flex overflow-hidden leading-[1.15] ${className}`}>
      {Array.from(text).map((char, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block transition-transform duration-500 ease-out-expo [text-shadow:0_1.15em_currentColor] group-hover/roll:-translate-y-[1.15em]"
          style={{ transitionDelay: `${i * 18}ms` }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}
