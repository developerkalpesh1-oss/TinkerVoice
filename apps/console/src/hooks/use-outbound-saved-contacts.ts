"use client";

import { useEffect, useState } from "react";

import {
  OUTBOUND_CONTACTS_STORAGE_KEY,
  parseStoredContacts,
  type OutboundSavedContact,
} from "@/src/lib/outbound/saved-contacts";
import {
  notifyTinkerismCallDataChanged,
  TINKERISM_CALL_DATA_CHANGED_EVENT,
} from "@/src/lib/tinkerism/storage-sync";

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

export function useOutboundSavedContacts() {
  const [hydrated, setHydrated] = useState(false);
  const [contacts, setContacts] = useState<OutboundSavedContact[]>([]);

  useEffect(() => {
    setContacts(parseStoredContacts(readStorage(OUTBOUND_CONTACTS_STORAGE_KEY)));
    setHydrated(true);

    function sync() {
      const next = parseStoredContacts(readStorage(OUTBOUND_CONTACTS_STORAGE_KEY));
      setContacts((current) => (
        JSON.stringify(current) === JSON.stringify(next) ? current : next
      ));
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
    const serialized = JSON.stringify(contacts);
    if (readStorage(OUTBOUND_CONTACTS_STORAGE_KEY) === serialized) return;
    writeStorage(OUTBOUND_CONTACTS_STORAGE_KEY, serialized);
    notifyTinkerismCallDataChanged();
  }, [contacts, hydrated]);

  return {
    contacts,
    setContacts,
  };
}
