"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useUser } from "../../../context/UserContext";

const links = [
  { href: "/estates", label: "Estates" },
  { href: "/payment-plans", label: "Payment Plans" },
  { href: "/application", label: "Land Application" },
  { href: "/ati-plus", label: "ATI Plus" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const router = useRouter();
  const { user, logout } = useUser();

  const isAuthenticated = !!user;
  const isCustomer = user?.role === "CUSTOMER";
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUB_ADMIN";

  if (pathname?.startsWith("/admin") || isAdmin) {
    return null;
  }
  // Everyone can see all public links
  const visibleLinks = links.filter((link) => {
    if (link.href === "/application" || link.href === "/ati-plus") {
      return isAuthenticated;
    }

    return true;
  });
  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <header className="sticky top-0 z-40 border-b border-navy-800/10 bg-white/90 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}>
          <Image
            src="/images/logo.png"
            alt="Adashè-to-Plot"
            width={168}
            height={44}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-navy-950 ${
                pathname === link.href ? "text-navy-950" : "text-ink-500"
              }`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {!isAuthenticated && (
            <Link
              href="/login"
              className="text-sm font-medium text-ink-500 hover:text-navy-950">
              Login
            </Link>
          )}

          {isCustomer && (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-navy-800/15 px-4 py-2.5 text-sm font-semibold text-navy-900 hover:border-navy-800/40">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-navy-800/15 px-4 py-2.5 text-sm font-semibold text-navy-900 hover:border-navy-800/40">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}

          <Link
            href="/estates"
            className="inline-flex items-center rounded-full bg-navy-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800">
            Explore Properties
          </Link>
        </div>

        <button
          className="rounded-full p-2 text-navy-950 lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-navy-800/10 bg-white px-5 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-ink-700 hover:bg-navy-50">
                {link.label}
              </Link>
            ))}

            {isCustomer && (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-ink-700 hover:bg-navy-50">
                Dashboard
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin/dashboard"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-ink-700 hover:bg-navy-50">
                Admin Dashboard
              </Link>
            )}

            {!isAuthenticated && (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-ink-700 hover:bg-navy-50">
                Login / Register
              </Link>
            )}

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 flex w-full items-center gap-3 rounded-lg border-t border-navy-800/10 px-3 py-4 text-left text-sm font-semibold text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </nav>

          <Link
            href="/estates"
            onClick={() => setOpen(false)}
            className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-navy-950 px-5 py-3 text-sm font-semibold text-white">
            Explore Properties
          </Link>
        </div>
      )}
    </header>
  );
}
