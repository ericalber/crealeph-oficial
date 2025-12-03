export const metadata = { robots: { index: false, follow: false } } as const;

export default function AppCompetitionPage() {
  const events = [
    { time: "10:21", type: "Watcher", msg: "Competitor A updated pricing in Centro" },
    { time: "09:58", type: "Crawler", msg: "New landing detected for Competitor B" },
  ];
  return (
    <section>
      <h1 className="text-2xl font-semibold">Competition (Scout)</h1>
      <ul className="mt-6 space-y-2 text-sm">
        {events.map((e, i) => (
          <li key={`${e.time}-${e.type}-${i}`} className="rounded-[--radius] border border-line bg-white p-3">
            <span className="text-muted">{e.time}</span> — <strong>{e.type}</strong>: {e.msg}
          </li>
        ))}
      </ul>
    </section>
  );
}
