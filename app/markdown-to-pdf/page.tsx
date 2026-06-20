"use client";
import ToolPageLayout from "@/components/ToolPageLayout";
import HtmlMarkdownToPdfTool from "@/components/tools/HtmlMarkdownToPdfTool";
import { FileCode } from "lucide-react";
export default function Page() {
  return (
    <ToolPageLayout title="Markdown to PDF" description="Write or paste Markdown and convert it to a formatted PDF." badge="Convert" icon={FileCode}>
      <HtmlMarkdownToPdfTool mode="markdown" />
    </ToolPageLayout>
  );
}
