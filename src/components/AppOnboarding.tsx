import { Check, Info, MessageSquare, ShieldCheck, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export const FEEDBACK_URL = "https://github.com/byronbourg23-debug/nhlguess/issues/new";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FirstUseOnboarding({
  onDismiss,
  onOpenPrivacy,
}: {
  onDismiss: () => void;
  onOpenPrivacy: () => void;
}) {
  return (
    <section
      aria-labelledby="beta-quick-start-title"
      className="mb-4 rounded-lg border border-border bg-card p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id="beta-quick-start-title" className="text-base font-semibold tracking-tight">
            Welcome to the beta
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search your player, record opponent clues, then save the game for later.
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss beta onboarding"
          title="Dismiss"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4">
        <ChecklistLegend />
      </div>
      <StorageNotice />

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          Got it
        </button>
        <button
          type="button"
          onClick={onOpenPrivacy}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
        >
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Privacy
        </button>
      </div>
    </section>
  );
}

export function TabHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 border-l-2 border-primary pl-3 text-sm font-medium text-muted-foreground">
      {children}
    </p>
  );
}

export function HowToPlayDialog({ open, onOpenChange }: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-lg p-5">
        <DialogHeader>
          <DialogTitle>How to Play</DialogTitle>
          <DialogDescription>Use the three tabs as a simple game notebook.</DialogDescription>
        </DialogHeader>

        <ol className="grid gap-2 text-sm">
          <li>
            <strong>My Player:</strong> Search for your selected player.
          </li>
          <li>
            <strong>Opponent(s):</strong> Record clues for each opponent.
          </li>
          <li>
            <strong>Save:</strong> Save or restore the current game.
          </li>
        </ol>

        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold">Checklist states</h3>
          <div className="mt-3">
            <ChecklistLegend />
          </div>
        </div>

        <StorageNotice />

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Done
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PrivacyDialog({ open, onOpenChange }: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-lg p-5">
        <DialogHeader>
          <DialogTitle>Privacy</DialogTitle>
          <DialogDescription>How this beta handles game data.</DialogDescription>
        </DialogHeader>

        <ul className="grid gap-3 text-sm text-foreground">
          <li>Opponent data and saved sessions are stored in this browser using localStorage.</li>
          <li>No account is required.</li>
          <li>Game data is not intentionally uploaded to an application database.</li>
          <li>Clearing browser data will remove saved games from this browser or device.</li>
        </ul>

        <p className="border-t border-border pt-4 text-xs text-muted-foreground">
          Player lookup sends requests needed to retrieve NHL player information. Opening Feedback
          takes you to GitHub.
        </p>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Done
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function FeedbackLink() {
  return (
    <a
      href={FEEDBACK_URL}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md px-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
    >
      <MessageSquare className="h-4 w-4" aria-hidden="true" />
      Feedback
    </a>
  );
}

function ChecklistLegend() {
  return (
    <div className="grid gap-2 text-sm sm:grid-cols-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white">
          <Check className="h-4 w-4" aria-hidden="true" />
        </span>
        <span>Green = confirmed</span>
      </div>
      <div className="flex min-w-0 items-center gap-2">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-red-600 text-white">
          <X className="h-4 w-4" aria-hidden="true" />
        </span>
        <span>Red X = ruled out</span>
      </div>
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
          Auto
        </span>
        <span>Calculated from another confirmed answer</span>
      </div>
    </div>
  );
}

function StorageNotice() {
  return (
    <p className="mt-4 flex items-start gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>
        Saved games stay only in this browser and device. Clearing browser data removes them.
      </span>
    </p>
  );
}
