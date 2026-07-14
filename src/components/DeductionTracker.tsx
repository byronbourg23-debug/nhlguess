import { useEffect, useState } from "react";
import { createEmptyChecklist } from "../lib/checklist";
import type { Opponent, SavedSession } from "../lib/types";
import {
  deleteSavedSession,
  loadOpponents,
  loadSavedSessions,
  makeId,
  saveGameSession,
  saveOpponents,
} from "../lib/storage";
import { OpponentSetup } from "./OpponentSetup";
import { OpponentDeductionCard } from "./OpponentDeductionCard";
import { SavedSessionsPanel } from "./SavedSessionsPanel";

type TrackerView = "opponents" | "save" | null;

export function DeductionTracker({ view }: { view: TrackerView }) {
  const [opponents, setOpponents] = useState<Opponent[]>([]);
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [sessionName, setSessionName] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [sessionMessage, setSessionMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setOpponents(loadOpponents());
    setSavedSessions(loadSavedSessions());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    saveOpponents(opponents);
  }, [isLoaded, opponents]);

  function addOpponent(name: string) {
    setOpponents((current) => [
      ...current,
      { id: makeId(), name, explicitChecklist: createEmptyChecklist() },
    ]);
  }

  function updateOpponent(nextOpponent: Opponent) {
    setOpponents((current) =>
      current.map((opponent) => (opponent.id === nextOpponent.id ? nextOpponent : opponent)),
    );
  }

  function deleteOpponent(id: string) {
    setOpponents((current) => current.filter((opponent) => opponent.id !== id));
  }

  function refreshSavedSessions(nextSelectedId?: string) {
    setSavedSessions(loadSavedSessions());
    if (nextSelectedId !== undefined) setSelectedSessionId(nextSelectedId);
  }

  function saveSession() {
    const saved = saveGameSession({
      sessionId: selectedSessionId || undefined,
      name: sessionName,
      opponents,
    });

    if (!saved) {
      setSessionMessage("Enter a session name before saving.");
      return;
    }

    setSessionName(saved.name);
    refreshSavedSessions(saved.id);
    setSessionMessage(`Saved ${saved.name}.`);
  }

  function loadSession() {
    const session = savedSessions.find((item) => item.id === selectedSessionId);
    if (!session) return;

    setOpponents(session.opponents);
    setSessionName(session.name);
    setSessionMessage(`Loaded ${session.name}.`);
  }

  function deleteSession() {
    const session = savedSessions.find((item) => item.id === selectedSessionId);
    if (!session) return;
    if (!confirm(`Delete saved session "${session.name}"?`)) return;

    deleteSavedSession(session.id);
    setSessionName("");
    refreshSavedSessions("");
    setSessionMessage(`Deleted ${session.name}.`);
  }

  return (
    <>
      <section
        id="panel-opponents"
        role="tabpanel"
        aria-labelledby="tab-opponents"
        hidden={view !== "opponents"}
        className="flex flex-col gap-4"
      >
        <OpponentSetup
          onAdd={addOpponent}
          onReset={() => setOpponents([])}
          hasAny={opponents.length > 0}
        />
        {opponents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Add an opponent to start marking the checklist.
          </div>
        ) : (
          opponents.map((opponent) => (
            <OpponentDeductionCard
              key={opponent.id}
              opponent={opponent}
              onUpdate={updateOpponent}
              onDelete={deleteOpponent}
            />
          ))
        )}
      </section>

      <section id="panel-save" role="tabpanel" aria-labelledby="tab-save" hidden={view !== "save"}>
        <SavedSessionsPanel
          sessionName={sessionName}
          selectedSessionId={selectedSessionId}
          savedSessions={savedSessions}
          message={sessionMessage}
          onSessionNameChange={(name) => {
            setSessionName(name);
            setSessionMessage("");
          }}
          onSelectedSessionChange={(id) => {
            setSelectedSessionId(id);
            setSessionMessage("");
          }}
          onSave={saveSession}
          onLoad={loadSession}
          onDelete={deleteSession}
        />
      </section>
    </>
  );
}
