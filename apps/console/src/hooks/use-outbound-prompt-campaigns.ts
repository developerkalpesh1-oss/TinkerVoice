"use client";

import { useEffect, useState } from "react";

import {
  DEFAULT_OUTBOUND_PROMPT_CAMPAIGN,
  OUTBOUND_PROMPT_CAMPAIGNS_STORAGE_KEY,
  OUTBOUND_SELECTED_PROMPT_CAMPAIGN_STORAGE_KEY,
  TINKERISM_CALL_DATA_CHANGED_EVENT,
  parseStoredPromptCampaignSelection,
  parseStoredPromptCampaigns,
  removePromptCampaign,
  upsertPromptCampaign,
  type OutboundPromptCampaign,
} from "@/src/lib/outbound/prompt-campaigns";
import { notifyTinkerismCallDataChanged } from "@/src/lib/tinkerism/storage-sync";

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private browsing should not block the page.
  }
}

function loadCampaignState(): {
  campaigns: OutboundPromptCampaign[];
  selectedId: string;
} {
  const campaigns = parseStoredPromptCampaigns(readStorage(OUTBOUND_PROMPT_CAMPAIGNS_STORAGE_KEY));
  return {
    campaigns,
    selectedId: parseStoredPromptCampaignSelection(
      readStorage(OUTBOUND_SELECTED_PROMPT_CAMPAIGN_STORAGE_KEY),
      campaigns,
    ),
  };
}

function sameCampaignState(
  left: { campaigns: OutboundPromptCampaign[]; selectedId: string },
  right: { campaigns: OutboundPromptCampaign[]; selectedId: string },
) {
  return (
    left.selectedId === right.selectedId
    && JSON.stringify(left.campaigns) === JSON.stringify(right.campaigns)
  );
}

export function useOutboundPromptCampaigns() {
  const [hydrated, setHydrated] = useState(false);
  const [campaigns, setCampaigns] = useState<OutboundPromptCampaign[]>([
    { ...DEFAULT_OUTBOUND_PROMPT_CAMPAIGN, sources: [] },
  ]);
  const [selectedId, setSelectedId] = useState(DEFAULT_OUTBOUND_PROMPT_CAMPAIGN.id);

  useEffect(() => {
    const loaded = loadCampaignState();
    setCampaigns(loaded.campaigns);
    setSelectedId(loaded.selectedId);
    setHydrated(true);

    function sync() {
      const next = loadCampaignState();
      setCampaigns((current) => (
        JSON.stringify(current) === JSON.stringify(next.campaigns) ? current : next.campaigns
      ));
      setSelectedId((current) => (current === next.selectedId ? current : next.selectedId));
    }

    window.addEventListener("storage", sync);
    window.addEventListener(TINKERISM_CALL_DATA_CHANGED_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(TINKERISM_CALL_DATA_CHANGED_EVENT, sync);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const next = { campaigns, selectedId };
    const stored = loadCampaignState();
    if (sameCampaignState(stored, next)) return;
    writeStorage(OUTBOUND_PROMPT_CAMPAIGNS_STORAGE_KEY, JSON.stringify(campaigns));
    writeStorage(OUTBOUND_SELECTED_PROMPT_CAMPAIGN_STORAGE_KEY, selectedId);
    notifyTinkerismCallDataChanged();
  }, [campaigns, hydrated, selectedId]);

  return {
    campaigns,
    selectedId,
    selectedCampaign:
      campaigns.find((campaign) => campaign.id === selectedId)
      ?? campaigns[0]
      ?? { ...DEFAULT_OUTBOUND_PROMPT_CAMPAIGN, sources: [] },
    selectCampaign: setSelectedId,
    saveCampaign: (campaign: OutboundPromptCampaign) => {
      setCampaigns((current) => upsertPromptCampaign(current, campaign));
      setSelectedId(campaign.id);
    },
    deleteCampaign: (id: string) => {
      setCampaigns((current) => {
        const remaining = removePromptCampaign(current, id);
        setSelectedId((selected) => (
          selected === id
            ? remaining[0]?.id ?? DEFAULT_OUTBOUND_PROMPT_CAMPAIGN.id
            : selected
        ));
        return remaining;
      });
    },
  };
}
