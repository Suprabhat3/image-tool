"use client";
import ToolPageLayout from "@/components/ToolPageLayout";
import PdfPageNumbersTool from "@/components/tools/PdfPageNumbersTool";
import { Hash } from "lucide-react";
export default function Page() {
  return (
    <ToolPageLayout title="Page Numbers & Headers" description="Add page numbers, headers, and footers to your PDF document." badge="Annotate" icon={Hash}>
      <PdfPageNumbersTool />
    </ToolPageLayout>
  );
}
