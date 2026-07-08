import { useState } from "react";
import { PlayerSearchInput } from "./PlayerSearchInput";
import { PlayerInfoCard } from "./PlayerInfoCard";
import { getPlayerDetails, normalizePlayerData } from "../lib/nhlApi";
import type { NHLPlayer } from "../lib/types";

export function PlayerLookup() {
  const [player, setPlayer] = useState<NHLPlayer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastId, setLastId] = useState<string | null>(null);

  async function loadPlayer(playerId: string) {
    setLoading(true);
    setError(null);
    setPlayer(null);
    try {
      const raw = await getPlayerDetails(playerId);
      setPlayer(normalizePlayerData(raw));
    } catch {
      setError("Could not load player details. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(playerId: string) {
    setLastId(playerId);
    loadPlayer(playerId);
  }

  return (
    <div>
      <PlayerSearchInput onSelect={handleSelect} />
      {loading && <div className="mt-4 text-sm text-muted-foreground">Loading player…</div>}
      {error && (
        <div className="mt-4 flex items-center justify-between gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <span>{error}</span>
          {lastId && (
            <button
              type="button"
              onClick={() => loadPlayer(lastId)}
              className="rounded border border-red-300 bg-white px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
            >
              Retry
            </button>
          )}
        </div>
      )}
      {player && <PlayerInfoCard player={player} />}
    </div>
  );
}
