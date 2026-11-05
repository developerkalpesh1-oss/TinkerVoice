"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  numbersApi,
  type BuyNumberInput,
  type NumberSearchParams,
  type UpdateNumberInput,
} from "@/src/lib/api/resources/numbers";
import { queryKeys } from "@/src/lib/query-keys";

export function useNumbers() {
  return useQuery({
    queryKey: queryKeys.numbers.list(),
    queryFn: () => numbersApi.list(),
  });
}

export function useNumberCountries(provider: NumberSearchParams["provider"], enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.numbers.countries(provider),
    queryFn: () => numbersApi.countries(provider),
    enabled,
    staleTime: 5 * 60_000,
    retry: false,
  });
}

export function useNumberSearch(
  params: NumberSearchParams | null,
  enabled: boolean,
) {
  return useQuery({
    queryKey: queryKeys.numbers.search(
      params as unknown as Record<string, unknown>,
    ),
    queryFn: () => numbersApi.search(params!),
    enabled: enabled && !!params,
  });
}

export function useOwnedTwilioNumbers(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.numbers.twilioOwned(),
    queryFn: () => numbersApi.listOwnedTwilio(),
    enabled,
    retry: false,
  });
}

export function useImportTwilioNumber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (phoneNumber: string) => numbersApi.importTwilio(phoneNumber),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.numbers.list() }),
        qc.invalidateQueries({ queryKey: queryKeys.numbers.twilioOwned() }),
      ]);
      toast.success("Twilio number added. Assign it to an agent to use it as the caller ID.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Could not add the Twilio number");
    },
  });
}

export function useBuyNumber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: BuyNumberInput) => numbersApi.buy(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.numbers.list() });
      toast.success("Number purchased");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Could not purchase number");
    },
  });
}

export function useUpdateNumber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ phId, input }: { phId: string; input: UpdateNumberInput }) =>
      numbersApi.update(phId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.numbers.list() });
      qc.invalidateQueries({ queryKey: queryKeys.agents.list() });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Could not update number");
    },
  });
}

export function useReleaseNumber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ phId }: { phId: string; externallyOwned?: boolean }) =>
      numbersApi.release(phId),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.numbers.list() }),
        qc.invalidateQueries({ queryKey: queryKeys.numbers.twilioOwned() }),
        qc.invalidateQueries({ queryKey: queryKeys.agents.list() }),
      ]);
      toast.success(
        variables.externallyOwned
          ? "Removed from TinkerVoice. The number stays on your Twilio account."
          : "Phone number released permanently",
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Could not release number");
    },
  });
}
