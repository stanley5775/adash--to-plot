"use client";

import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { InspectionForm } from "./InspectionForm";
import { Button } from "@/components/ui/Button";

export function BookInspectionButton({
  propertyTitle,
  variant = "primary",
  size = "md",
  className = "",
  label = "Book Inspection",
}: {
  propertyTitle?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={() => setOpen(true)}>
        <CalendarCheck className="h-4 w-4" /> {label}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Book an Inspection">
        <InspectionForm propertyTitle={propertyTitle} onSuccess={() => {}} />
      </Modal>
    </>
  );
}
