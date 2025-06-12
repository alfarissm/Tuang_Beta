import { Suspense } from "react";
import PembeliPageClient from "./PembeliPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PembeliPageClient />
    </Suspense>
  );
}