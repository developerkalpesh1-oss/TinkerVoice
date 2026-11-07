/**
 * Outbound reuses Tinkerism Call campaign storage and helpers so both screens
 * share one set of campaigns, knowledge sources, and selection state.
 */
export {
  CALL_KNOWLEDGE_CHAR_LIMIT,
  MAX_KNOWLEDGE_FILE_BYTES,
  MAX_KNOWLEDGE_SOURCES,
  SOURCE_TEXT_CHAR_LIMIT,
  DEFAULT_TINKERISM_CAMPAIGN as DEFAULT_OUTBOUND_PROMPT_CAMPAIGN,
  TINKERISM_CAMPAIGNS_STORAGE_KEY as OUTBOUND_PROMPT_CAMPAIGNS_STORAGE_KEY,
  TINKERISM_SELECTED_CAMPAIGN_STORAGE_KEY as OUTBOUND_SELECTED_PROMPT_CAMPAIGN_STORAGE_KEY,
  blankCampaign as blankPromptCampaign,
  campaignError as promptCampaignError,
  campaignForCalls as promptCampaignForCalls,
  cleanExtractedText,
  createCampaignId,
  knowledgeFileError,
  knowledgeForCall,
  knowledgeUrlError,
  normalizeCampaign as normalizePromptCampaign,
  parseStoredCampaignSelection as parseStoredPromptCampaignSelection,
  parseStoredCampaigns as parseStoredPromptCampaigns,
  removeCampaign as removePromptCampaign,
  tinkerismCampaignPrompt,
  upsertCampaign as upsertPromptCampaign,
  type TinkerismCampaign as OutboundPromptCampaign,
  type TinkerismKnowledgeSource as OutboundKnowledgeSource,
} from "@/src/lib/tinkerism/campaigns";

export { TINKERISM_CALL_DATA_CHANGED_EVENT } from "@/src/lib/tinkerism/storage-sync";

export {
  applyCampaignPromptToRecipientCsv,
  withCampaignPromptOnRecipientFile,
} from "@/src/lib/outbound/prompt-campaign-csv";

import { tinkerismCampaignPrompt, type TinkerismCampaign } from "@/src/lib/tinkerism/campaigns";

/** Same prompt Tinkerism Call sends on every dial. */
export function outboundCampaignSystemPrompt(
  campaign: TinkerismCampaign,
  name: string,
  phoneNumber: string,
  _options: { greetingAlreadySpoken?: boolean } = {},
): string {
  return tinkerismCampaignPrompt(campaign, name || "the recipient", phoneNumber || "the dialed number");
}

/** Shared campaign prompt for batch CSV rows. */
export function outboundCampaignBatchSystemPrompt(campaign: TinkerismCampaign): string {
  return tinkerismCampaignPrompt(campaign, "the recipient", "the dialed number");
}
