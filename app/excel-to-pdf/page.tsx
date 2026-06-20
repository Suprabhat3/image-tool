"use client";
import ToolPageLayout from "@/components/ToolPageLayout";
import OfficeToPdfTool from "@/components/tools/OfficeToPdfTool";
import { Sheet } from "lucide-react";
export default function Page() {
  return (
    <ToolPageLayout title="Excel to PDF" description="Convert Excel spreadsheets (.xlsx, .xls) to PDF with all sheets included." badge="Convert" icon={Sheet}>
      <OfficeToPdfTool type="excel" />
    </ToolPageLayout>
  );
}
