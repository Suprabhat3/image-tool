"use client";
import ToolPageLayout from "@/components/ToolPageLayout";
import HtmlMarkdownToPdfTool from "@/components/tools/HtmlMarkdownToPdfTool";
import { Code } from "lucide-react";
export default function Page() {
  return (
    <ToolPageLayout title="HTML to PDF" description="Paste HTML and render it as a downloadable PDF document." badge="Convert" icon={Code}>
      <HtmlMarkdownToPdfTool mode="html" />
    </ToolPageLayout>
  );
}
