import { PageHeader } from "@/src/components/common/PageHeader";
import { TinkerismCallPanel } from "@/src/components/tinkerism/TinkerismCallPanel";

export default function TinkerismCallPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tinkerism Call"
        description="Use Call Now to dial every selected number and connect each person to the agent."
      />
      <TinkerismCallPanel />
    </div>
  );
}
