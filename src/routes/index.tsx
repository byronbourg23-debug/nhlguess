import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PlayerLookup } from "../components/PlayerLookup";
import { DeductionTracker } from "../components/DeductionTracker";
import type { NHLPlayer } from "../lib/types";

export const Route = createFileRoute("/")({
  component: Index,
});

type Tab = "my-player" | "opponents" | "save";

function Index() {
  const [tab, setTab] = useState<Tab>("my-player");
  const [selectedPlayer, setSelectedPlayer] = useState<NHLPlayer | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 shadow-sm">
        <div className="mx-auto max-w-2xl px-4 pt-4">
          <h1 className="text-lg font-bold tracking-tight">NHL Guessing Helper</h1>
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
