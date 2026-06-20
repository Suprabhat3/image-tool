"use client";
import ToolPageLayout from "@/components/ToolPageLayout";
import OfficeToPdfTool from "@/components/tools/OfficeToPdfTool";
import { Presentation } from "lucide-react";
export default function Page() {
  return (
    <ToolPageLayout title="PPT to PDF" description="Convert PowerPoint presentations (.pptx) to PDF in your browser." badge="Convert" icon={Presentation}>
      <OfficeToPdfTool type="pptx" />
    </ToolPageLayout>
  );
}
