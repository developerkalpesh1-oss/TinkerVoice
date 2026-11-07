import { PageHeader } from "@/src/components/common/PageHeader";
import { TinkerismCallPanel } from "@/src/components/tinkerism/TinkerismCallPanel";

export default function TinkerismCallPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tinkerism Call"
        description="Save a campaign prompt and knowledge on this page, then dial every selected number with that setup."
      />
      <TinkerismCallPanel />
    </div>
  );
}
