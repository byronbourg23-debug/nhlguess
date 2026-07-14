import { FolderOpen, Save, Trash2 } from "lucide-react";
import type { SavedSession } from "../lib/types";

type Props = {
  sessionName: string;
  selectedSessionId: string;
  savedSessions: SavedSession[];
  message: string;
  onSessionNameChange: (name: string) => void;
  onSelectedSessionChange: (id: string) => void;
  onSave: () => void;
  onLoad: () => void;
  onDelete: () => void;
};

const fieldClass =
  "w-full min-w-0 rounded-md border border-border bg-background px-3 py-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-ring";

export function SavedSessionsPanel({
  sessionName,
  selectedSessionId,
  savedSessions,
  message,
  onSessionNameChange,
  onSelectedSessionChange,
  onSave,
  onLoad,
  onDelete,
}: Props) {
  const hasSelection = Boolean(selectedSessionId);

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <h2 className="text-base font-semibold tracking-tight">Saved Game Sessions</h2>

      <form
        className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
      >
        <label className="sr-only" htmlFor="session-name">
          Session name
        </label>
        <input
          id="session-name"
          value={sessionName}
          onChange={(event) => onSessionNameChange(event.target.value)}
          placeholder="Session name"
          className={fieldClass}
        />
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Save Session
        </button>
      </form>

      {savedSessions.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          No saved sessions yet.
        </div>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
          <label className="sr-only" htmlFor="saved-session">
            Saved session
          </label>
          <select
            id="saved-session"
            value={selectedSessionId}
            onChange={(event) => onSelectedSessionChange(event.target.value)}
            className={fieldClass}
          >
            <option value="">Select saved session</option>
            {savedSessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onLoad}
            disabled={!hasSelection}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FolderOpen className="h-4 w-4" aria-hidden="true" />
            Load Session
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={!hasSelection}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 shadow-sm transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete Saved Session
          </button>
        </div>
      )}

      {message ? (
        <p className="mt-3 text-sm text-muted-foreground" role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
    </div>
  );
}
