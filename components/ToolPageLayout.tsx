"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, LucideIcon } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

interface ToolPageLayoutProps {
  title: string;
  description: string;
  badge: string;
  icon: LucideIcon;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
  maxWidth?: "2xl" | "4xl" | "7xl";
}

export default function ToolPageLayout({
  title,
  description,
  badge,
  icon: Icon,
  backHref = "/tools",
  backLabel = "Back to All Tools",
  children,
  maxWidth = "7xl",
}: ToolPageLayoutProps) {
  const maxW = { "2xl": "max-w-2xl", "4xl": "max-w-4xl", "7xl": "max-w-7xl" }[maxWidth];

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-emerald-200/50 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000 z-0" />

      <SiteNav />

      <div className={`relative z-10 w-full ${maxW} mx-auto px-4 flex flex-col gap-8 sm:gap-12 flex-1 items-center pt-4 pb-12 sm:pt-8 sm:pb-16`}>
        <header className="text-center space-y-3 sm:space-y-4 max-w-2xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/5 rounded-full border border-primary/20 text-xs sm:text-sm font-bold text-primary shadow-sm backdrop-blur-sm">
            <Icon className="w-3 h-3 sm:w-4 sm:h-4" /> {badge}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-sm sm:text-base text-secondary-foreground">{description}</p>
        </header>

        <div className="w-full">{children}</div>

        <Link href={backHref} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> {backLabel}
        </Link>
      </div>

      <SiteFooter />
    </main>
  );
}
