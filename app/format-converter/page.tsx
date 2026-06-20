"use client";
import ToolPageLayout from "@/components/ToolPageLayout";
import FormatConverterTool from "@/components/tools/FormatConverterTool";
import { Repeat } from "lucide-react";
export default function Page() {
  return (
    <ToolPageLayout title="Format Converter" description="Convert images between JPEG, PNG, and WEBP with a live compare slider." badge="Convert" icon={Repeat} backHref="/image-tools" backLabel="Back to Image Tools">
      <FormatConverterTool />
    </ToolPageLayout>
  );
}
