import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

test("outbound batch creation and campaign management share one tab", () => {
  const page = read("src/app/(app)/outbound/page.tsx");
  const batchForm = read("src/components/outbound/BatchCallForm.tsx");
  const workspace = read("src/components/outbound/BatchCampaignWorkspace.tsx");
  const quick = read("src/components/outbound/QuickCallForm.tsx");

  assert.match(page, /<TabsTrigger value="batch">Batch campaigns<\/TabsTrigger>/);
  assert.doesNotMatch(page, /TabsTrigger value="campaigns"/);
  assert.match(page, /<TabsContent value="batch"[\s\S]*<BatchCampaignWorkspace \/>/);
  assert.match(page, /<TabsTrigger value="calls">Outbound calls<\/TabsTrigger>/);
  assert.match(page, /<TabsContent value="quick"[\s\S]*<QuickCallForm \/>/);
  assert.match(batchForm, /Batch campaigns/);
  assert.doesNotMatch(batchForm, /Batch queue/);
  assert.doesNotMatch(batchForm, /useBatchCampaigns/);
  assert.match(workspace, /PromptCampaignPanel/);
  assert.match(workspace, /SavedContactsPanel/);
  assert.match(workspace, /CampaignsPanel/);
  assert.match(workspace, /tinkerismCampaignPrompt/);
  assert.match(workspace, /campaignOpeningGreeting/);
  assert.match(workspace, /callSelectedContacts/);
  assert.doesNotMatch(quick, /PromptCampaignPanel/);
  assert.doesNotMatch(quick, /SavedContactsPanel/);
  assert.match(quick, /QuickCallContactField/);
  assert.match(quick, /tinkerismCampaignPrompt/);
  assert.match(quick, /campaignOpeningGreeting/);
  assert.match(quick, /tinkerism_call/);
});
