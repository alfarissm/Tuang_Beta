import { Suspense } from "react";
import PembeliPageClient from "./pageclient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PembeliPageClient />
    </Suspense>
  );
}