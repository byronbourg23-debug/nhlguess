import { useEffect, useState } from "react";
import type { Opponent, SavedSession } from "../lib/types";
import {
  deleteSavedSession,
  loadOpponents,
  loadSavedSessions,
  makeEmptyDeductionRow,
  makeId,
  saveGameSession,
  saveOpponents,
} from "../lib/storage";
import { OpponentSetup } from "./OpponentSetup";
import { OpponentDeductionCard } from "./OpponentDeductionCard";

const fieldClass =
  "w-full min-w-0 rounded-md border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-ring";

const saveButtonClass =
  "inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700";

const dangerButtonClass =
  "inline-flex items-center justify-center rounded-md border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 shadow-sm transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50";

export function DeductionTracker() {
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
    setOpponents((prev) => [...prev, { id: makeId(), name, rows: [makeEmptyDeductionRow()] }]);
  }
  function updateOpponent(o: Opponent) {
    setOpponents((prev) => prev.map((p) => (p.id === o.id ? o : p)));
  }
  function deleteOpponent(id: string) {
    setOpponents((prev) => prev.filter((p) => p.id !== id));
  }
  function reset() {
    setOpponents([]);
  }

  function refreshSavedSessions(nextSelectedId?: string) {
    const sessions = loadSavedSessions();
    setSavedSessions(sessions);
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

  function loadSession(sessionId: string) {
    setSelectedSessionId(sessionId);
    const session = savedSessions.find((item) => item.id === sessionId);
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
    <div className="flex flex-col gap-4">
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold tracking-tight">Game Session</h2>
          <p className="text-sm text-muted-foreground">
            Save this tracker locally, then load it again later.
          </p>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="sr-only" htmlFor="session-name">
            Session name
          </label>
          <input
            id="session-name"
            value={sessionName}
            onChange={(e) => {
              setSessionName(e.target.value);
              setSessionMessage("");
            }}
            placeholder="Session name"
            className={fieldClass}
          />
          <button type="button" onClick={saveSession} className={saveButtonClass}>
            Save Session
          </button>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="sr-only" htmlFor="saved-session">
            Load saved session
          </label>
          <select
            id="saved-session"
            value={selectedSessionId}
            onChange={(e) => loadSession(e.target.value)}
            className={fieldClass}
            disabled={savedSessions.length === 0}
          >
            <option value="">
              {savedSessions.length === 0 ? "No saved sessions yet." : "Load saved session"}
            </option>
            {savedSessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={deleteSession}
            className={dangerButtonClass}
            disabled={!selectedSessionId}
          >
            Delete Saved Session
          </button>
        </div>

        {sessionMessage ? (
          <p className="mt-2 text-sm text-muted-foreground">{sessionMessage}</p>
        ) : null}
      </section>

      <OpponentSetup onAdd={addOpponent} onReset={reset} hasAny={opponents.length > 0} />
      {opponents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
          Add opponents to start tracking deduction rows.
        </div>
      ) : (
        opponents.map((o) => (
          <OpponentDeductionCard
            key={o.id}
            opponent={o}
            onUpdate={updateOpponent}
            onDelete={deleteOpponent}
          />
        ))
      )}
    </div>
  );
}
