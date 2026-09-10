import type { Metadata } from "next";
import LandApplicationPage from "@/components/application/LandApplicationPage";
export const metadata: Metadata = {
  title: "Land Application | Adashè to Plot",
  description:
    "Submit your land application securely and pay the one-time application fee online.",
};
export default function Page() {
  return <LandApplicationPage />;
}

// const { data, isLoading } = useCheckApplication();

// if (isLoading) {
//   return <div>Checking application...</div>;
// }

// if (data?.data?.isApplication) {
//   return <AlreadyRegistered />;
// }

// return <ApplicationForm />;