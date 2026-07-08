import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PlayerLookup } from "../components/PlayerLookup";
import { DeductionTracker } from "../components/DeductionTracker";

export const Route = createFileRoute("/")({
  component: Index,
});

type Tab = "lookup" | "tracker";

function Index() {
  const [tab, setTab] = useState<Tab>("lookup");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="mx-auto max-w-xl px-4 pt-4">
          <h1 className="text-lg font-bold">NHL Guessing Helper</h1>
        </div>
        <nav className="mx-auto mt-3 flex max-w-xl gap-1 px-4">
          <TabButton active={tab === "lookup"} onClick={() => setTab("lookup")}>
            Player Lookup
          </TabButton>
          <TabButton active={tab === "tracker"} onClick={() => setTab("tracker")}>
            Deduction Tracker
          </TabButton>
        </nav>
      </header>
      <main className="mx-auto max-w-xl px-4 py-4">
        {tab === "lookup" ? <PlayerLookup /> : <DeductionTracker />}
      </main>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-t-md border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
