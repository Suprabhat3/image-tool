"use client";

import Link from "next/link";
import type { ToolCard, ToolCategory } from "@/lib/tools-config";

interface ToolsGridProps {
  categories: ToolCategory[];
  columns?: 2 | 3 | 4;
}

function ToolCardLink({ tool }: { tool: ToolCard }) {
  return (
    <Link
      href={tool.href}
      className="group flex items-start gap-4 p-5 bg-white/50 backdrop-blur-xl border border-white/50 rounded-2xl shadow-sm hover:shadow-lg hover:bg-white/70 hover:-translate-y-0.5 transition-all"
    >
      <div className={`w-11 h-11 ${tool.bg} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
        <tool.icon className={`w-5 h-5 ${tool.color}`} />
      </div>
      <div className="min-w-0">
        <h3 className="font-bold text-foreground text-sm sm:text-base mb-0.5">{tool.title}</h3>
        <p className="text-xs sm:text-sm text-secondary-foreground leading-snug">{tool.description}</p>
      </div>
    </Link>
  );
}

export default function ToolsGrid({ categories, columns = 3 }: ToolsGridProps) {
  const colClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[columns];

  return (
    <div className="w-full space-y-10">
      {categories.map((category) => (
        <section key={category.id}>
          <div className="mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{category.title}</h2>
            <p className="text-sm text-secondary-foreground mt-1">{category.description}</p>
          </div>
          <div className={`grid grid-cols-1 ${colClass} gap-4`}>
            {category.tools.map((tool) => (
              <ToolCardLink key={tool.href} tool={tool} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function PopularToolsRow({ tools }: { tools: ToolCard[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
      {tools.map((tool) => (
        <Link
          key={tool.href}
          href={tool.href}
          className="group flex flex-col items-center text-center p-4 bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl hover:bg-white/60 hover:-translate-y-0.5 transition-all"
        >
          <div className={`w-10 h-10 ${tool.bg} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
            <tool.icon className={`w-5 h-5 ${tool.color}`} />
          </div>
          <span className="text-xs sm:text-sm font-bold text-foreground leading-tight">{tool.title}</span>
        </Link>
      ))}
    </div>
  );
}
