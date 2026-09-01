"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { JoinAtiPlusForm } from "./JoinAtiPlusForm";
import { Button } from "@/components/ui/Button";

export function JoinAtiPlusButton({ size = "lg" }: { size?: "sm" | "md" | "lg" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size={size} onClick={() => setOpen(true)}>
        <Star className="h-4 w-4" /> Join ATI Plus
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Join ATI Plus">
        <JoinAtiPlusForm />
      </Modal>
    </>
  );
}
