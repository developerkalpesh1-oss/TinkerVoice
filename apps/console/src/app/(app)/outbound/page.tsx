"use client";

import { PageHeader } from "@/src/components/common/PageHeader";
import { BatchCampaignWorkspace } from "@/src/components/outbound/BatchCampaignWorkspace";
import { OutboundCallsPanel } from "@/src/components/outbound/OutboundCallsPanel";
import { QuickCallForm } from "@/src/components/outbound/QuickCallForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

export default function OutboundPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Outbound"
        description="Start a quick call, or manage campaigns, knowledge, and saved contacts under Batch campaigns."
      />
      <Tabs defaultValue="quick" className="w-full">
        <TabsList>
          <TabsTrigger value="quick">Quick call</TabsTrigger>
          <TabsTrigger value="batch">Batch campaigns</TabsTrigger>
          <TabsTrigger value="calls">Outbound calls</TabsTrigger>
        </TabsList>
        <TabsContent value="quick" className="mt-4">
          <QuickCallForm />
        </TabsContent>
        <TabsContent value="batch" className="mt-4">
          <BatchCampaignWorkspace />
        </TabsContent>
        <TabsContent value="calls" className="mt-4">
          <OutboundCallsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
