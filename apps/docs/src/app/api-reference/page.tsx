import type { Metadata } from "next";
import { ScalarApiReference } from "@/components/api/scalar-api-reference";

export const metadata: Metadata = {
  title: "API Reference",
  description: "Interactive TinkerVoice REST API reference powered by Scalar and OpenAPI.",
};

export default function ApiReferencePage() {
  return <ScalarApiReference />;
}
