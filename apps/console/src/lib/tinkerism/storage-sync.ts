/** Fired in the same tab when Tinkerism Call / Outbound mutate shared campaign or contact storage. */
export const TINKERISM_CALL_DATA_CHANGED_EVENT = "tinkerism-call:data-changed";

export function notifyTinkerismCallDataChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(TINKERISM_CALL_DATA_CHANGED_EVENT));
}
