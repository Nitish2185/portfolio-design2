/** Four-point star used as a separator and decoration. */
export function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className} fill="currentColor">
      <path d="M32 0l6.4 25.6L64 32l-25.6 6.4L32 64l-6.4-25.6L0 32l25.6-6.4z" />
    </svg>
  );
}
