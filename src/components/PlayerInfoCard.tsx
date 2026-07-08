import type { NHLPlayer } from "../lib/types";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

export function PlayerInfoCard({ player }: { player: NHLPlayer }) {
  const isGoalie = player.position === "G" && player.goalieStats;

  return (
    <div className="mt-4 rounded-lg border border-border bg-card p-4">
      <h2 className="text-lg font-semibold">{player.fullName}</h2>
      <p className="text-sm text-muted-foreground">
        {player.team} · #{String(player.jerseyNumber)} · {player.position}
      </p>

      <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Basic Info
      </h3>
      <div className="mt-1">
        <Row label="Shoots/Catches" value={String(player.shootsCatches)} />
        <Row label="Height" value={player.height} />
        <Row label="Weight" value={player.weight} />
        <Row label="Age" value={String(player.age)} />
        <Row label="Birth date" value={player.birthDate} />
        <Row label="Birth city" value={player.birthCity} />
        <Row label="Birth country" value={player.birthCountry} />
      </div>

      <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {isGoalie ? "Current Season (Goalie)" : "Current Season"}
      </h3>
      <div className="mt-1">
        {isGoalie ? (
          <>
            <Row label="Games played" value={String(player.goalieStats!.gamesPlayed)} />
            <Row label="Wins" value={String(player.goalieStats!.wins)} />
            <Row label="Losses" value={String(player.goalieStats!.losses)} />
            <Row label="Save %" value={String(player.goalieStats!.savePercentage)} />
            <Row label="GAA" value={String(player.goalieStats!.goalsAgainstAverage)} />
            <Row label="Shutouts" value={String(player.goalieStats!.shutouts)} />
          </>
        ) : (
          <>
            <Row label="Games played" value={String(player.gamesPlayed)} />
            <Row label="Goals" value={String(player.goals)} />
            <Row label="Assists" value={String(player.assists)} />
            <Row label="Points" value={String(player.points)} />
            <Row label="+/-" value={String(player.plusMinus)} />
            <Row label="PIM" value={String(player.penaltyMinutes)} />
          </>
        )}
      </div>
    </div>
  );
}
