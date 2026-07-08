import { useCallback, useEffect, useRef, useState } from "react";
import { searchPlayers, type SearchResult } from "../lib/nhlApi";

interface Props {
  onSelect: (playerId: string) => void;
}

export function PlayerSearchInput({ onSelect }: Props) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const seq = useRef(0);

  const runSearch = useCallback(async (q: string) => {
    const my = ++seq.current;
    setLoading(true);
    setError(null);
    try {
      const r = await searchPlayers(q);
      if (my !== seq.current) return;
      setResults(r);
    } catch {
      if (my !== seq.current) return;
      setError("Could not search players. Try again.");
      setResults([]);
    } finally {
      if (my === seq.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q = term.trim();
    if (q.length < 2) {
      seq.current++;
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }
    const t = setTimeout(() => {
      runSearch(q);
    }, 250);
    return () => clearTimeout(t);
  }, [term, runSearch]);

  return (
    <div className="w-full">
      <input
        type="text"
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          setTouched(true);
        }}
        placeholder="Search NHL player (e.g. McDavid)"
        className="w-full rounded-md border border-border bg-background px-3 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
      />
      {loading && <div className="mt-2 text-sm text-muted-foreground">Searching…</div>}
      {error && (
        <div className="mt-2 flex items-center justify-between gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => runSearch(term.trim())}
            className="rounded border border-red-300 bg-white px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      )}
      {!loading && !error && touched && term.trim().length >= 2 && results.length === 0 && (
        <div className="mt-2 text-sm text-muted-foreground">No players found.</div>
      )}
      {results.length > 0 && (
        <ul className="mt-2 divide-y divide-border rounded-md border border-border">
          {results.map((r) => (
            <li key={r.playerId}>
              <button
                type="button"
                onClick={() => {
                  onSelect(r.playerId);
                  setTerm(r.name);
                  setResults([]);
                }}
                className="flex w-full items-center justify-between px-3 py-3 text-left hover:bg-accent"
              >
                <span className="font-medium">{r.name}</span>
                <span className="text-xs text-muted-foreground">
                  {r.teamAbbrev ?? ""} {r.positionCode ? `· ${r.positionCode}` : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
