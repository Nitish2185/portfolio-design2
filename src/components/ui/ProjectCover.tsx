import type { Project } from "@/content/site";

type Props = {
  project: Project;
  className?: string;
  /** Extra class on the inner layer (used for parallax). */
  innerClassName?: string;
  showTitle?: boolean;
};

/** Deterministic pseudo-random number in [0, 1) so the art is identical on server and client. */
function seeded(i: number) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function Art({ project }: { project: Project }) {
  const [a, b, c] = project.palette;

  switch (project.pattern) {
    case "rings":
      return (
        <div
          className="absolute inset-0"
          style={{
            background: `repeating-radial-gradient(circle at 30% 70%, ${a} 0 22px, ${c} 22px 44px, ${b} 44px 50px, ${c} 50px 72px)`,
          }}
        />
      );
    case "grid":
      return (
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-6" style={{ background: b }}>
          {Array.from({ length: 48 }, (_, i) => {
            const r = seeded(i);
            const fill = r > 0.86 ? a : r > 0.78 ? c : "transparent";
            return (
              <div
                key={i}
                className="border border-white/5 transition-colors duration-700 hover:!bg-[var(--hover)] hover:duration-0"
                style={{ background: fill, ["--hover" as string]: a }}
              />
            );
          })}
        </div>
      );
    case "stripes":
      return (
        <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(-45deg, ${a} 0 28px, ${c} 28px 56px)` }}>
          <div className="absolute top-1/2 left-1/2 size-[55%] -translate-1/2 rounded-full" style={{ background: b }} />
          <div className="absolute top-1/2 left-1/2 size-[30%] -translate-1/2 rounded-full" style={{ background: c }} />
        </div>
      );
    case "orbit":
      return (
        <div className="absolute inset-0" style={{ background: c }}>
          <div
            className="absolute top-1/2 left-1/2 size-[38%] -translate-1/2 rounded-full blur-2xl"
            style={{ background: a }}
          />
          {[0.5, 0.75, 1].map((size, i) => (
            <div
              key={size}
              className="absolute top-1/2 left-1/2 aspect-square -translate-1/2 animate-spin rounded-full border"
              style={{
                width: `${size * 90}%`,
                borderColor: `${b}55`,
                animationDuration: `${8 + i * 6}s`,
                animationDirection: i % 2 ? "reverse" : "normal",
              }}
            >
              <span className="absolute top-0 left-1/2 size-3 -translate-1/2 rounded-full" style={{ background: b }} />
            </div>
          ))}
        </div>
      );
    case "blob":
    default:
      return (
        <div className="absolute inset-0" style={{ background: c }}>
          <div className="absolute top-[5%] left-[0%] size-[75%] animate-float rounded-full blur-3xl" style={{ background: a }} />
          <div
            className="absolute right-[0%] bottom-[0%] size-[60%] animate-float rounded-full blur-3xl"
            style={{ background: b, animationDelay: "-3s" }}
          />
        </div>
      );
  }
}

/** Generated cover art for a project — replace with real screenshots later. */
export function ProjectCover({ project, className = "", innerClassName = "", showTitle = true }: Props) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`absolute -inset-[12%] ${innerClassName}`}>
        <Art project={project} />
      </div>
      {showTitle && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center font-display text-[clamp(2rem,5vw,5rem)] leading-[0.9] font-black text-bone uppercase mix-blend-difference">
          {project.title}
        </span>
      )}
    </div>
  );
}
