import React from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Database, EyeOff } from "lucide-react";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-200/50 rounded-full mix-blend-multiply filter blur-[120px] animate-blob z-0"></div>

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
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-foreground">
            Total Privacy, <br />
            <span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              By Design.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-secondary-foreground mx-auto font-medium">
            We built ImageTool with a radical premise: what if we didn't collect
            any data at all?
          </p>
        </header>

        <div
          className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/50 shadow-xl space-y-10 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground">
              <EyeOff className="text-primary w-6 h-6" /> Zero Uploads
            </h2>
            <p className="text-secondary-foreground leading-relaxed">
              When you use our tool, your images are <strong>never</strong>{" "}
              transmitted across the internet. We do not have servers processing
              your data. Instead, our site loads a small web app directly onto
              your device, allowing your browser to handle all computations
              locally. Once you open the webpage, you don't even need an active
              internet connection to edit your images!
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground">
              <Database className="text-primary w-6 h-6" /> Zero Storage
            </h2>
            <p className="text-secondary-foreground leading-relaxed">
              Because we don't upload your files, there is no mysterious cloud
              server storing them. Your photos sit on your local hard drive or
              phone memory before, during, and after processing. When you hit
              "Download", the browser simply saves the modified file from your
              own memory back into your downloads folder.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Analytics & Tracking
            </h2>
            <p className="text-secondary-foreground leading-relaxed">
              We respect your privacy footprint. We do not integrate invasive
              third-party ad trackers, nor do we run scripts that harvest your
              personal device data. We only rely on basic, privacy-respecting
              analytics to track general website visits, entirely scrubbed of
              personally identifiable information.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
