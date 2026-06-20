"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, FileText, Image as ImageIcon, LayoutGrid } from "lucide-react";

const navLinks = [
  { href: "/tools", label: "All Tools", icon: LayoutGrid },
  { href: "/image-tools", label: "Image", icon: ImageIcon },
  { href: "/pdf-tools", label: "PDF", icon: FileText },
  { href: "/features", label: "Features" },
  { href: "/faq", label: "FAQ" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
        <img src="/image-logo.png" alt="ImageTool" className="h-8 sm:h-9 w-auto" />
      </Link>

      <div className="hidden md:flex items-center gap-1 lg:gap-2">
        {navLinks.map((link) => {
          const Icon = "icon" in link ? link.icon : null;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-secondary-foreground hover:text-primary hover:bg-primary/5"
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {link.label}
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="md:hidden p-2 rounded-xl border border-gray-200 bg-white/60 text-foreground"
        aria-label="Toggle menu"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <div className="absolute top-full left-4 right-4 mt-2 md:hidden bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl p-3 flex flex-col gap-1">
          {navLinks.map((link) => {
            const Icon = "icon" in link ? link.icon : null;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold ${
                  isActive(link.href) ? "bg-primary/10 text-primary" : "text-secondary-foreground"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
