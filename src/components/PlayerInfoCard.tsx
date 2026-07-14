import type { NHLPlayer, PreviousTeamEntry } from "../lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr className="border-b border-border last:border-b-0">
      <th className="w-1/2 px-3 py-2.5 text-left align-top text-sm font-medium text-black">
        {label}
      </th>
      <td className="break-words px-3 py-2.5 text-right align-top text-sm font-semibold text-black">
        {value}
      </td>
    </tr>
  );
}

export function PlayerInfoCard({ player }: { player: NHLPlayer }) {
  return (
    <section className="mt-4 rounded-xl border border-border bg-card p-4 text-black shadow-sm">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-black">{player.fullName}</h2>
        <p className="mt-1 text-sm font-medium text-black">Basic Info</p>
      </div>
      <div className="mt-3 overflow-hidden rounded-lg border border-border">
        <table className="w-full border-collapse">
          <tbody>
            <Row label="Current Team" value={player.team} />
            <Row label="Conference" value={player.conference} />
            <Row label="Division" value={player.division} />
            <Row label="Position" value={player.position} />
            <Row label="Nation" value={player.birthCountry} />
            <Row label="Number" value={String(player.jerseyNumber)} />
            <Row label="Hand" value={String(player.shootsCatches)} />
          </tbody>
        </table>
        <PreviousTeams entries={player.previousTeams} />
      </div>
    </section>
  );
}

function PreviousTeams({ entries }: { entries: PreviousTeamEntry[] }) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="previous-teams" className="border-b-0 border-t border-border">
        <AccordionTrigger className="px-3 py-3 text-sm font-medium hover:no-underline">
          <span className="flex min-w-0 flex-1 items-center justify-between gap-3 pr-2 text-left">
            <span>Previous Teams</span>
            <span className="shrink-0 text-xs font-semibold text-muted-foreground">
              ({entries.length})
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="pb-0">
          {entries.length > 0 ? (
            <table className="w-full table-fixed border-collapse border-t border-border">
              <caption className="sr-only">Previous team history</caption>
              <colgroup>
                <col className="w-[23%]" />
                <col className="w-[39%]" />
                <col className="w-[38%]" />
              </colgroup>
              <thead className="bg-muted/60">
                <tr>
                  <HistoryHeading>Year</HistoryHeading>
                  <HistoryHeading>Team</HistoryHeading>
                  <HistoryHeading>League</HistoryHeading>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={`${entry.year}-${entry.team}-${entry.league}`}
                    className="border-t border-border first:border-t-0"
                  >
                    <HistoryCell>{entry.year}</HistoryCell>
                    <HistoryCell>{entry.team}</HistoryCell>
                    <HistoryCell>{entry.league}</HistoryCell>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="border-t border-border px-3 py-3 text-sm font-medium text-black">N/A</p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function HistoryHeading({ children }: { children: React.ReactNode }) {
  return (
    <th className="break-words px-2 py-2 text-left text-xs font-bold text-black sm:px-3">
      {children}
    </th>
  );
}

function HistoryCell({ children }: { children: React.ReactNode }) {
  return (
    <td className="break-words px-2 py-2.5 align-top text-xs font-medium text-black sm:px-3 sm:text-sm">
      {children}
    </td>
  );
}
