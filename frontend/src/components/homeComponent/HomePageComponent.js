import React, { lazy, Suspense } from "react";

// Lazy load the AllEventList component
const AllEventList = lazy(() => import("../EventListComponent/AllEventList"));

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllEventList />
    </Suspense>
  );
}
