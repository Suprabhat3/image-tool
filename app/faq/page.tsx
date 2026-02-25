import React from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      q: "How does it process my images internally?",
      a: "ImageTool uses modern web APIs (like HTML5 Canvas and WebAssembly) allowing your browser to read, render, compress, and re-encode images purely using your device's local CPU power.",
    },
    {
      q: "Can I use the app offline?",
      a: "Yes! Once you have loaded the webpage on your device, the processing engine runs purely in the client. You can safely disconnect from Wi-Fi and still crop or compress your images perfectly.",
    },
    {
      q: "Are my photos uploaded or saved on a server?",
      a: "Absolutely not. Zero bits of your images ever leave your device. The entire process is strictly confidential by design.",
    },
    {
      q: "What file formats do you support?",
      a: "You can load almost any standard image (JPEG, PNG, WEBP, GIF, HEIC on supported devices). You can then export and seamlessly convert it to highly-optimized JPEG, PNG, or WEBP files.",
    },
    {
      q: "Does compression ruin my image quality?",
      a: "Not necessarily. We use highly calibrated compression heuristics. By letting you set a specific output size (KB), the algorithm attempts to preserve the absolute maximum visual fidelity while hitting your storage constraints.",
    },
  ];

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0"></div>

      <nav className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center animate-fade-in-up">
        <Link
          href="/"
          className="flex items-center gap-2 group cursor-pointer shrink-0"
        >
          <img
            src="/image-logo.png"
            alt="Image Tool Logo"
            className="h-8 sm:h-10 w-auto"
          />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-secondary-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to App
        </Link>
      </nav>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <header className="text-center space-y-4 mb-16 animate-fade-in-up">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-foreground">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
        </header>

        <div
          className="space-y-6 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/50 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-bold text-foreground mb-3">
                {faq.q}
              </h3>
              <p className="text-secondary-foreground leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
