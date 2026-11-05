"use client";

import { useState } from "react";
import { Loader2, PhoneIncoming } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useImportTwilioNumber, useOwnedTwilioNumbers } from "@/src/hooks/queries/numbers";

export function UseTwilioNumberButton({
  label = "Use Twilio number",
}: {
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const owned = useOwnedTwilioNumbers(open);
  const importNumber = useImportTwilioNumber();

  async function addNumber(phoneNumber: string) {
    if (adding) return;
    setAdding(phoneNumber);
    try {
      await importNumber.mutateAsync(phoneNumber);
    } catch {
      // The mutation hook shows the API error.
    } finally {
      setAdding(null);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="outline">
          <PhoneIncoming /> {label}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-0 overflow-y-auto p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        <SheetHeader className="shrink-0 border-b px-6 py-5">
          <SheetTitle>Use a Twilio number</SheetTitle>
          <SheetDescription>
            Add a voice number you already bought in Twilio. TinkerVoice does not buy it again, and removing it later leaves it on your Twilio account.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 px-6 py-5">
          {owned.isPending ? (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          ) : owned.isError ? (
            <p className="text-sm text-destructive">
              {owned.error instanceof Error
                ? owned.error.message
                : "Twilio numbers could not be loaded."}
            </p>
          ) : owned.data?.length ? (
            <ul className="flex flex-col gap-2">
              {owned.data.map((number) => (
                <li
                  key={number.sid}
                  className="flex items-center justify-between gap-3 rounded-lg border px-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{number.friendlyName}</p>
                    <p className="truncate font-mono text-sm text-muted-foreground">
                      {number.phoneNumber}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    disabled={number.alreadyAdded || adding !== null}
                    onClick={() => void addNumber(number.phoneNumber)}
                  >
                    {adding === number.phoneNumber ? (
                      <Loader2 className="animate-spin" />
                    ) : null}
                    {number.alreadyAdded ? "Added" : "Use"}
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              This Twilio account has no voice numbers yet. Buy one in Twilio, then open this list again.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
