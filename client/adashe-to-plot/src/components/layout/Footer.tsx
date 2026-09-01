"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin } from "lucide-react";
import { WHATSAPP_DISPLAY_NUMBER } from "@/lib/whatsapp";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-navy-950 text-navy-100">
      <div className="container-page grid grid-cols-1 gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <Image
            src="/images/logo.png"
            alt="Adashè-to-Plot"
            width={168}
            height={44}
            className="h-9 w-auto brightness-0 invert"
          />
          <p className="mt-4 text-sm leading-relaxed text-navy-100/70">
            Pay small small, own a property. Verified plots and premium homes across Abuja, backed by flexible
            payment plans and secure documentation.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Explore</h4>
          <ul className="mt-4 space-y-3 text-sm text-navy-100/70">
            <li><Link href="/estates" className="hover:text-gold-400">Estates</Link></li>
            <li><Link href="/payment-plans" className="hover:text-gold-400">Payment Plans</Link></li>
            <li><Link href="/ati-plus" className="hover:text-gold-400">ATI Plus Membership</Link></li>
            <li><Link href="/about" className="hover:text-gold-400">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Portal</h4>
          <ul className="mt-4 space-y-3 text-sm text-navy-100/70">
            <li><Link href="/dashboard" className="hover:text-gold-400">Customer Dashboard</Link></li>
            <li><Link href="/application" className="hover:text-gold-400">Land Application</Link></li>
            <li><Link href="/login" className="hover:text-gold-400">Login</Link></li>
            <li><Link href="/register" className="hover:text-gold-400">Register</Link></li>
            <li><Link href="/contact" className="hover:text-gold-400">Book an Inspection</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-navy-100/70">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-gold-400" /> {WHATSAPP_DISPLAY_NUMBER}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-gold-400" /> achezyhomes@gmail.com
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> Plot 14, Cadastral Zone, Kuje, Abuja, FCT
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-page flex flex-col items-center justify-between gap-3 text-xs text-navy-100/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Adashè-to-Plot. All rights reserved.</p>
          <p>Prototype for client presentation — no live payments are processed.</p>
        </div>
      </div>
    </footer>
  );
}
