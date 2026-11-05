export type TinkerismCallBlock =
  | "loading"
  | "ready"
  | "no-agent"
  | "no-number"
  | "inactive-number"
  | "none-selected";

export function tinkerismCallBlock(input: {
  loading: boolean;
  configuredAgentCount: number;
  activeCallerIdCount: number;
  inactiveNumberCount: number;
  selectedCount: number;
}): TinkerismCallBlock {
  if (input.loading) return "loading";
  if (input.configuredAgentCount === 0) return "no-agent";
  if (input.activeCallerIdCount === 0) {
    return input.inactiveNumberCount > 0 ? "inactive-number" : "no-number";
  }
  if (input.selectedCount === 0) return "none-selected";
  return "ready";
}

export function callerIdsForAgent<T extends { agentId: string | null; billingStatus: string }>(
  numbers: T[],
  agentId: string,
): T[] {
  return numbers.filter(
    (number) =>
      number.billingStatus === "ACTIVE" &&
      (number.agentId === agentId || number.agentId === null),
  );
}
