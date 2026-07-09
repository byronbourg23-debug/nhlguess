import type { NHLPlayer } from "../lib/types";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr className="border-b border-border last:border-b-0">
      <th className="w-1/2 px-3 py-2 text-left text-sm font-medium text-black">{label}</th>
      <td className="px-3 py-2 text-right text-sm font-semibold text-black">{value}</td>
    </tr>
  );
}

export function PlayerInfoCard({ player }: { player: NHLPlayer }) {
  return (
    <section className="mt-4 rounded-lg border border-border bg-card p-4 text-black">
      <h2 className="text-lg font-semibold text-black">Basic Info</h2>
      <div className="mt-3 overflow-hidden rounded-md border border-border">
        <table className="w-full border-collapse">
          <tbody>
            <Row label="Full Name" value={player.fullName} />
            <Row label="Current Team" value={player.team} />
            <Row label="Number" value={String(player.jerseyNumber)} />
            <Row label="Position" value={player.position} />
            <Row label="Conference" value={player.conference} />
            <Row label="Division" value={player.division} />
            <Row label="Country/Nationality" value={player.birthCountry} />
            <Row label="Hand" value={String(player.shootsCatches)} />
            <Row label="Previous Teams" value={player.previousTeams} />
          </tbody>
        </table>
      </div>
    </section>
  );
}
