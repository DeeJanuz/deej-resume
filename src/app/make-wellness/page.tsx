import type { Metadata } from "next";
import { MakeWellnessProposalClient } from "./MakeWellnessProposalClient";

export const metadata: Metadata = {
  title: "MAKE Wellness Data Engineering Proposal",
  description: "Private MAKE Wellness data engineering proposal.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    noimageindex: true,
    nosnippet: true,
  },
};

export default function MakeWellnessProposalPage() {
  return <MakeWellnessProposalClient />;
}
