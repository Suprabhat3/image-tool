import Link from "next/link";
import { Globe, Twitter, Linkedin } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 w-full mt-auto py-8 px-4 border-t border-primary/10 bg-white/20 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6 text-center">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-secondary-foreground">
          <Link href="/tools" className="hover:text-primary transition-colors">All Tools</Link>
          <Link href="/image-tools" className="hover:text-primary transition-colors">Image Tools</Link>
          <Link href="/pdf-tools" className="hover:text-primary transition-colors">PDF Tools</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
        </div>
        <p className="text-sm text-secondary-foreground/70 max-w-md leading-relaxed">
          100% client-side processing. Your files never leave your device.
        </p>
        <div className="flex items-center gap-3">
          <a href="https://suprabhat.site" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/60 hover:bg-white rounded-full shadow-sm hover:text-primary transition-all border border-primary/10">
            <Globe className="w-4 h-4" />
          </a>
          <a href="https://x.com/suprabhat_3" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/60 hover:bg-white rounded-full shadow-sm hover:text-primary transition-all border border-primary/10">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="https://www.linkedin.com/in/suprabhatt" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/60 hover:bg-white rounded-full shadow-sm hover:text-primary transition-all border border-primary/10">
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
