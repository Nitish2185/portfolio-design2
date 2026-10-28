import { site } from "@/content/site";

export default function Home() {
  return (
    <main className="container-x flex min-h-svh flex-col justify-center gap-6">
      <p className="label">Portfolio</p>
      <h1 className="font-display text-[14vw] leading-[0.85] font-black uppercase">
        {site.firstName}
        <br />
        <span className="text-outline-acid">{site.lastName}</span>
      </h1>
      <p className="max-w-md text-smoke">{site.tagline}</p>
    </main>
  );
}
