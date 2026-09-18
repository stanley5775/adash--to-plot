import { PropertyContent } from "@/components/properties/PropertyContent";
import { Suspense } from "react";

export default function EstatesPage() {
  return (
    <>
      <Suspense fallback={null}>
        <PropertyContent />
      </Suspense>
    </>
  );
}
