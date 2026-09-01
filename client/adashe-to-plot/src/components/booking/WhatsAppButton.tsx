"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function WhatsAppButton({
  message,
  label = "Chat With an Agent on WhatsApp",
  className = "",
  size = "md",
}: {
  message: string;
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3.5 text-sm",
    lg: "px-8 py-4 text-base",
  }[size];

  return (
    <a
      href={buildWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#1FA855] font-semibold text-white transition-colors hover:bg-[#188C46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1FA855] ${sizeClasses} ${className}`}
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </a>
  );
}
