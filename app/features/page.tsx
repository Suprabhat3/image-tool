import React from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, Shield, Zap, Image as ImageIcon } from "lucide-react";

export default function Features() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob z-0"></div>

      <nav className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center animate-fade-in-up">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <img
            src="/image-logo.png"
            alt="Image Tool Logo"
            className="h-10 w-auto"
          />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-secondary-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to App
        </Link>
      </nav>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-16 sm:py-24">
        <header className="text-center space-y-4 mb-16 animate-fade-in-up">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-foreground">
            Built for{" "}
            <span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent p-2">
              Power & Privacy
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-secondary-foreground max-w-2xl mx-auto font-medium">
            Discover how our entirely on-device processing engine completely
            redefines the way you optimize your media.
          </p>
        </header>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="glass-panel p-8 rounded-3xl border border-white/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
              <Cpu className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">
              100% Client-Side Engine
            </h3>
            <p className="text-secondary-foreground leading-relaxed">
              Our tool leverages modern WebAssembly and HTML5 Canvas APIs to
              handle all image decoding, manipulation, and encoding straight
              from your device's CPU/GPU. No servers, no queues.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">
              Zero-Trust Privacy
            </h3>
            <p className="text-secondary-foreground leading-relaxed">
              Because everything happens within your browser's sandboxed
              environment, we never see your images. They are never uploaded
              anywhere. Your private photos remain truly private.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">
              Instantaneous Speed
            </h3>
            <p className="text-secondary-foreground leading-relaxed">
              Say goodbye to loading spinners and upload progress bars. By
              eliminating network transit wait times, large high-res photos
              compress and resize instantly on your local hardware.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/50 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">
              Flawless Scaling & Compression
            </h3>
            <p className="text-secondary-foreground leading-relaxed">
              Pick your exact output format, target a specific file size in KB,
              and hone in your crop limits. Next-generation compression
              algorithms squeeze out bites while keeping pixels crisp.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
