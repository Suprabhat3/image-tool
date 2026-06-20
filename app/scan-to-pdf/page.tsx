"use client";
import ToolPageLayout from "@/components/ToolPageLayout";
import ScanToPdfTool from "@/components/tools/ScanToPdfTool";
import { Camera } from "lucide-react";
export default function Page() {
  return (
    <ToolPageLayout title="Scan to PDF" description="Use your camera or upload photos to create a multi-page PDF scan." badge="Capture" icon={Camera}>
      <ScanToPdfTool />
    </ToolPageLayout>
  );
}
