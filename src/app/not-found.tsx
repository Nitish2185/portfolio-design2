import type { Metadata } from "next";
import { NotFound } from "@/components/sections/NotFound";

export const metadata: Metadata = { title: "Not found" };

export default function NotFoundPage() {
  return (
    <main>
      <NotFound />
    </main>
  );
}
