import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import {
  FeedbackLink,
  FirstUseOnboarding,
  HowToPlayDialog,
  PrivacyDialog,
  TabHint,
} from "../components/AppOnboarding";
import { PlayerLookup } from "../components/PlayerLookup";
import { DeductionTracker } from "../components/DeductionTracker";
import type { NHLPlayer } from "../lib/types";

export const Route = createFileRoute("/")({
  component: Index,
});

type Tab = "my-player" | "opponents" | "save";

const ONBOARDING_DISMISSED_KEY = "nhl-guess-helper:onboarding-dismissed:v1";
const TAB_HINTS: Readonly<Record<Tab, string>> = {
  "my-player": "Search for your selected player.",
  opponents: "Record clues for opponents.",
  save: "Save or restore the current game.",
};

function Index() {
  const [tab, setTab] = useState<Tab>("my-player");
  const [selectedPlayer, setSelectedPlayer] = useState<NHLPlayer | null>(null);
  const [showFirstUse, setShowFirstUse] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  useEffect(() => {
    try {
      setShowFirstUse(window.localStorage.getItem(ONBOARDING_DISMISSED_KEY) !== "true");
    } catch {
      setShowFirstUse(true);
    }
  }, []);

  function dismissOnboarding() {
    setShowFirstUse(false);
    try {
      window.localStorage.setItem(ONBOARDING_DISMISSED_KEY, "true");
    } catch {
      // The onboarding can still dismiss for this visit when storage is unavailable.
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 shadow-sm">
        <div className="mx-auto max-w-2xl px-4 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight">NHL Guessing Helper</h1>
              <span className="rounded-sm border border-border bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                Beta
              </span>
            </div>
            <button
              type="button"
              onClick={() => setHowToPlayOpen(true)}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-semibold transition-colors hover:bg-muted"
            >
              <HelpCircle className="h-4 w-4" aria-hidden="true" />
              How to Play
            </button>
          </div>
        </div>
        <nav
          className="mx-auto mt-3 flex max-w-2xl gap-1 px-4"
          role="tablist"
          aria-label="NHL Guessing Helper"
        >
          <TabButton
            id="tab-my-player"
            controls="panel-my-player"
            active={tab === "my-player"}
            onClick={() => setTab("my-player")}
          >
            My Player
          </TabButton>
          <TabButton
            id="tab-opponents"
            controls="panel-opponents"
            active={tab === "opponents"}
            onClick={() => setTab("opponents")}
          >
            Opponent(s)
          </TabButton>
          <TabButton
            id="tab-save"
            controls="panel-save"
            active={tab === "save"}
            onClick={() => setTab("save")}
          >
            Save
          </TabButton>
        </nav>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-5 sm:py-6">
        {showFirstUse ? <TabHint>{TAB_HINTS[tab]}</TabHint> : null}
        {showFirstUse && tab === "my-player" ? (
          <FirstUseOnboarding
            onDismiss={dismissOnboarding}
            onOpenPrivacy={() => setPrivacyOpen(true)}
          />
        ) : null}
        <section
          id="panel-my-player"
          role="tabpanel"
          aria-labelledby="tab-my-player"
          hidden={tab !== "my-player"}
        >
          <PlayerLookup selectedPlayer={selectedPlayer} setSelectedPlayer={setSelectedPlayer} />
        </section>
        <DeductionTracker view={tab === "my-player" ? null : tab} />
      </main>

      <footer className="mx-auto max-w-2xl px-4 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            Saved games stay on this browser and device.
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPrivacyOpen(true)}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md px-2 text-sm font-semibold transition-colors hover:bg-muted"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Privacy
            </button>
            <FeedbackLink />
          </div>
        </div>
      </footer>

      <HowToPlayDialog open={howToPlayOpen} onOpenChange={setHowToPlayOpen} />
      <PrivacyDialog open={privacyOpen} onOpenChange={setPrivacyOpen} />
    </div>
  );
}

function TabButton({
  id,
  controls,
  active,
  onClick,
  children,
}: {
  id: string;
  controls: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      id={id}
      role="tab"
      aria-controls={controls}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      className={`min-h-11 flex-1 rounded-t-md border-b-2 px-2 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
