"use client";

import { useState } from "react";
import { Handshake } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { InterestForm } from "./InterestForm";
import { Button } from "@/components/ui/Button";

export function InterestButton({ propertyTitle }: { propertyTitle: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={() => setOpen(true)}>
        <Handshake className="h-4 w-4" /> I&apos;m Interested in This Property
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Express Interest">
        <InterestForm propertyTitle={propertyTitle} />
      </Modal>
    </>
  );
}
