const noise =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>";

/** Animated film-grain texture over the whole site. */
export function Grain() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[150] overflow-hidden opacity-[0.07]">
      <div
        className="absolute -inset-1/2 animate-grain"
        style={{ backgroundImage: `url("${noise}")` }}
      />
    </div>
  );
}
