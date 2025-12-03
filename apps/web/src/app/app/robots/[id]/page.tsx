"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/dashboard/layout/PageHeader";
import { SectionHeader } from "@/components/dashboard/layout/SectionHeader";
import { DataTable } from "@/components/dashboard/data/DataTable";
import { Divider } from "@/components/dashboard/sections/Divider";
import { GhostButton } from "@/components/ui/GhostButton";
import { DashboardCard } from "@/components/dashboard/cards/DashboardCard";

const tabs = ["Overview", "Insights", "Campaigns", "Copywriting", "Market Twin", "Automations", "Config"] as const;

type Robot = {
  id: string;
  name: string;
  type: string;
  status: string;
  config: any;
  createdAt?: string;
};

type RobotRun = {
  id: string;
  createdAt: string;
  result: any;
};

type RobotIdea = {
  id: string;
  createdAt: string;
  result: any;
};

type RobotCopy = {
  id: string;
  createdAt: string;
  result: any;
};

type MarketTwinEntry = {
  id: string;
  createdAt: string;
  data: any;
};

type RobotPlaybook = {
  id: string;
  createdAt: string;
  actions: any;
};

export default function RobotConsolePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Overview");
  const [robot, setRobot] = useState<Robot | null>(null);
  const [loading, setLoading] = useState(false);
  const [runs, setRuns] = useState<RobotRun[]>([]);
  const [ideas, setIdeas] = useState<RobotIdea[]>([]);
  const [copies, setCopies] = useState<RobotCopy[]>([]);
  const [twinEntries, setTwinEntries] = useState<MarketTwinEntry[]>([]);
  const [playbooks, setPlaybooks] = useState<RobotPlaybook[]>([]);
  const [cleaning, setCleaning] = useState({
    promises: [] as string[],
    ctas: [] as string[],
    objections: [] as string[],
    priceWindows: [] as string[],
    reviewPatterns: [] as string[],
    competitorMoves: [] as string[],
    trendSignals: [] as string[],
  });

  const insightColumns = useMemo(
    () => [
      { key: "title", label: "Title" },
      { key: "detail", label: "Detail" },
      { key: "actions", label: "Actions", align: "right" as const },
    ],
    [],
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch(`/api/robots/${params.id}`);
      const json = await res.json().catch(() => null);
      setRobot(json?.data ?? null);
      const runsRes = await fetch(`/api/robots/${params.id}/runs`).catch(() => null);
      const runsJson = await runsRes?.json().catch(() => null);
      setRuns(runsJson?.data ?? []);
      const ideasRes = await fetch(`/api/robots/${params.id}/ideas`).catch(() => null);
      const ideasJson = await ideasRes?.json().catch(() => null);
      setIdeas(ideasJson?.data ?? []);
      const copiesRes = await fetch(`/api/robots/${params.id}/copy`).catch(() => null);
      const copiesJson = await copiesRes?.json().catch(() => null);
      setCopies(copiesJson?.data ?? []);
      if ((json?.data?.config?.niche ?? "").toLowerCase() === "cleaning") {
        const cleaningRes = await fetch(`/api/robots/${params.id}/cleaning-insights`).catch(() => null);
        const cleaningJson = await cleaningRes?.json().catch(() => null);
        setCleaning(cleaningJson?.data ?? cleaning);
      }
      const twinRes = await fetch(`/api/robots/${params.id}/market-twin/list`).catch(() => null);
      const twinJson = await twinRes?.json().catch(() => null);
      setTwinEntries(twinJson?.data ?? []);
      const pbRes = await fetch(`/api/robots/${params.id}/playbooks/list`).catch(() => null);
      const pbJson = await pbRes?.json().catch(() => null);
      setPlaybooks(pbJson?.data ?? []);
      setLoading(false);
    };
    load();
  }, [params.id]);

  const runRobot = async () => {
    await fetch("/api/robots/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: params.id }),
    });
    const runsRes = await fetch(`/api/robots/${params.id}/runs`).catch(() => null);
    const runsJson = await runsRes?.json().catch(() => null);
    setRuns(runsJson?.data ?? []);
    const ideasRes = await fetch(`/api/robots/${params.id}/ideas`).catch(() => null);
    const ideasJson = await ideasRes?.json().catch(() => null);
    setIdeas(ideasJson?.data ?? []);
    const copiesRes = await fetch(`/api/robots/${params.id}/copy`).catch(() => null);
    const copiesJson = await copiesRes?.json().catch(() => null);
    setCopies(copiesJson?.data ?? []);
    if ((robot?.config?.niche ?? "").toLowerCase() === "cleaning") {
      const cleaningRes = await fetch(`/api/robots/${params.id}/cleaning-insights`).catch(() => null);
      const cleaningJson = await cleaningRes?.json().catch(() => null);
      setCleaning(cleaningJson?.data ?? cleaning);
    }
    const twinRes = await fetch(`/api/robots/${params.id}/market-twin/list`).catch(() => null);
    const twinJson = await twinRes?.json().catch(() => null);
    setTwinEntries(twinJson?.data ?? []);
    const pbRes = await fetch(`/api/robots/${params.id}/playbooks/list`).catch(() => null);
    const pbJson = await pbRes?.json().catch(() => null);
    setPlaybooks(pbJson?.data ?? []);
  };

  const generateIdea = async () => {
    await fetch(`/api/robots/${params.id}/ideator/run`, { method: "POST" }).catch(() => null);
    const ideasRes = await fetch(`/api/robots/${params.id}/ideas`).catch(() => null);
    const ideasJson = await ideasRes?.json().catch(() => null);
    setIdeas(ideasJson?.data ?? []);
  };

  const generateCopy = async () => {
    await fetch(`/api/robots/${params.id}/copywriter/run`, { method: "POST" }).catch(() => null);
    const copiesRes = await fetch(`/api/robots/${params.id}/copy`).catch(() => null);
    const copiesJson = await copiesRes?.json().catch(() => null);
    setCopies(copiesJson?.data ?? []);
  };

  const runMarketTwin = async () => {
    await fetch(`/api/robots/${params.id}/market-twin/run`, { method: "POST" }).catch(() => null);
    const twinRes = await fetch(`/api/robots/${params.id}/market-twin/list`).catch(() => null);
    const twinJson = await twinRes?.json().catch(() => null);
    setTwinEntries(twinJson?.data ?? []);
  };

  const runPlaybooks = async () => {
    await fetch(`/api/robots/${params.id}/playbooks/run`, { method: "POST" }).catch(() => null);
    const pbRes = await fetch(`/api/robots/${params.id}/playbooks/list`).catch(() => null);
    const pbJson = await pbRes?.json().catch(() => null);
    setPlaybooks(pbJson?.data ?? []);
  };

  const latest = runs[0]?.result ?? {};
  const promisesList: string[] = Array.isArray(latest.promises) ? latest.promises : [];
  const ctasList: string[] = Array.isArray(latest.ctas) ? latest.ctas : [];
  const objectionsList: string[] = Array.isArray(latest.objections) ? latest.objections : [];
  const priceWindows: string[] = Array.isArray(latest.priceWindows) ? latest.priceWindows : [];
  const trendSignals: string[] = Array.isArray(latest.trendSignals) ? latest.trendSignals : [];

  const latestIdea = ideas[0]?.result ?? {};
  const headlineIdeas: string[] = Array.isArray(latestIdea.headlineIdeas) ? latestIdea.headlineIdeas : [];
  const angles: string[] = Array.isArray(latestIdea.angles) ? latestIdea.angles : [];
  const offers: string[] = Array.isArray(latestIdea.offers) ? latestIdea.offers : [];
  const callouts: string[] = Array.isArray(latestIdea.callouts) ? latestIdea.callouts : [];
  const scripts: string[] = Array.isArray(latestIdea.scripts) ? latestIdea.scripts : [];

  const latestCopy = copies[0]?.result ?? {};
  const landingPageSections: { title: string; body: string }[] = Array.isArray(latestCopy.landingPageSections)
    ? latestCopy.landingPageSections
    : [];
  const longFormScript: string = typeof latestCopy.longFormScript === "string" ? latestCopy.longFormScript : "";
  const emailVariants: string[] = Array.isArray(latestCopy.emailVariants) ? latestCopy.emailVariants : [];
  const adVariants: string[] = Array.isArray(latestCopy.adVariants) ? latestCopy.adVariants : [];
  const socialPosts: string[] = Array.isArray(latestCopy.socialPosts) ? latestCopy.socialPosts : [];

  const latestTwin = twinEntries[0]?.data ?? {};
  const pricePercentile = typeof latestTwin.pricePercentile === "number" ? latestTwin.pricePercentile : null;
  const ctaStrengthPercentile =
    typeof latestTwin.ctaStrengthPercentile === "number" ? latestTwin.ctaStrengthPercentile : null;
  const competitionLevel = typeof latestTwin.competitionLevel === "string" ? latestTwin.competitionLevel : "";
  const reviewQualityPercentile =
    typeof latestTwin.reviewQualityPercentile === "number" ? latestTwin.reviewQualityPercentile : null;
  const growthDirection = typeof latestTwin.growthDirection === "string" ? latestTwin.growthDirection : "";

  const latestPlaybook = playbooks[0]?.actions ?? [];
  const actions = Array.isArray(latestPlaybook) ? latestPlaybook : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={robot ? robot.name : `Robot Console — ${params.id}`}
        subtitle="Manage scans, signals and configuration."
        actions={
          <>
            <GhostButton onClick={runRobot}>Run Parasite</GhostButton>
            <GhostButton asChild>
              <Link href="/app/robots">Back to list</Link>
            </GhostButton>
          </>
        }
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-[var(--radius-sm)] px-3 py-1.5 text-sm ${
              activeTab === tab ? "bg-[var(--surface-muted)] text-[var(--ink)]" : "text-[var(--muted)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <DashboardCard>
          {loading ? (
            <p className="text-sm text-[var(--muted)]">Loading...</p>
          ) : robot ? (
            <div className="space-y-2">
              <p className="text-sm text-[var(--muted)]">Type: {robot.type}</p>
              <p className="text-sm text-[var(--muted)]">Status: {robot.status}</p>
              <p className="text-sm text-[var(--muted)]">
                Created: {robot.createdAt ? new Date(robot.createdAt).toLocaleString() : ""}
              </p>
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)]">Robot not found.</p>
          )}
        </DashboardCard>
      )}

      {activeTab === "Insights" && (
        <>
          {robot?.config?.niche?.toLowerCase?.() === "cleaning" ? (
            <div className="space-y-3">
              <SectionHeader
                title="Cleaning Signals"
                description="Key intelligence extracted for cleaning services."
              />
              <div className="grid gap-3 md:grid-cols-2">
                <DashboardCard>
                  <p className="text-sm font-semibold text-[var(--ink)]">Price Windows</p>
                  <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                    {cleaning.priceWindows.length
                      ? cleaning.priceWindows.map((p, i) => <li key={i}>• {p}</li>)
                      : <li>No price windows.</li>}
                  </ul>
                </DashboardCard>
                <DashboardCard>
                  <p className="text-sm font-semibold text-[var(--ink)]">Review Patterns</p>
                  <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                    {cleaning.reviewPatterns.length
                      ? cleaning.reviewPatterns.map((p, i) => <li key={i}>• {p}</li>)
                      : <li>No review patterns.</li>}
                  </ul>
                </DashboardCard>
                <DashboardCard>
                  <p className="text-sm font-semibold text-[var(--ink)]">Competitor Moves</p>
                  <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                    {cleaning.competitorMoves.length
                      ? cleaning.competitorMoves.map((p, i) => <li key={i}>• {p}</li>)
                      : <li>No competitor moves.</li>}
                  </ul>
                </DashboardCard>
                <DashboardCard>
                  <p className="text-sm font-semibold text-[var(--ink)]">Service Categories</p>
                  <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                    {Array.isArray(robot?.config?.serviceTypes) && robot.config.serviceTypes.length
                      ? robot.config.serviceTypes.map((p: string, i: number) => <li key={i}>• {p}</li>)
                      : <li>No service categories.</li>}
                  </ul>
                </DashboardCard>
                <DashboardCard className="md:col-span-2">
                  <p className="text-sm font-semibold text-[var(--ink)]">Trend Signals</p>
                  <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                    {cleaning.trendSignals.length
                      ? cleaning.trendSignals.map((p, i) => <li key={i}>• {p}</li>)
                      : <li>No trend signals.</li>}
                  </ul>
                </DashboardCard>
              </div>
            </div>
          ) : null}

          <SectionHeader title="Latest Insights" description="Signals detected by the most recent run." />
          {runs.length === 0 ? (
            <DataTable
              columns={insightColumns}
              rows={[
                {
                  title: "No runs yet",
                  detail: "Run the Parasite to collect signals.",
                  actions: <GhostButton onClick={runRobot}>Run now</GhostButton>,
                  key: "placeholder",
                },
              ]}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <DashboardCard>
                <p className="text-sm font-semibold text-[var(--ink)]">Promises</p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  {promisesList.length ? promisesList.map((p, i) => <li key={i}>• {p}</li>) : <li>No promises.</li>}
                </ul>
              </DashboardCard>
              <DashboardCard>
                <p className="text-sm font-semibold text-[var(--ink)]">CTAs</p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  {ctasList.length ? ctasList.map((p, i) => <li key={i}>• {p}</li>) : <li>No CTAs.</li>}
                </ul>
              </DashboardCard>
              <DashboardCard>
                <p className="text-sm font-semibold text-[var(--ink)]">Objections</p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  {objectionsList.length ? objectionsList.map((p, i) => <li key={i}>• {p}</li>) : <li>No objections.</li>}
                </ul>
              </DashboardCard>
              <DashboardCard>
                <p className="text-sm font-semibold text-[var(--ink)]">Price Windows</p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  {priceWindows.length ? priceWindows.map((p, i) => <li key={i}>• {p}</li>) : <li>No price windows.</li>}
                </ul>
              </DashboardCard>
              <DashboardCard className="md:col-span-2">
                <p className="text-sm font-semibold text-[var(--ink)]">Trend Signals</p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  {trendSignals.length ? trendSignals.map((p, i) => <li key={i}>• {p}</li>) : <li>No trend signals.</li>}
                </ul>
              </DashboardCard>
            </div>
          )}
        </>
      )}

      {activeTab === "Campaigns" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <SectionHeader
              title="Campaigns"
              description="Generate campaigns from Parasite signals."
            />
            <GhostButton onClick={generateIdea}>Generate Campaign</GhostButton>
          </div>
          {ideas.length === 0 ? (
            <DashboardCard>
              <p className="text-sm text-[var(--muted)]">No campaigns yet. Generate one to get started.</p>
            </DashboardCard>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <DashboardCard>
                <p className="text-sm font-semibold text-[var(--ink)]">Headline Ideas</p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  {headlineIdeas.length ? headlineIdeas.map((p, i) => <li key={i}>• {p}</li>) : <li>No headlines.</li>}
                </ul>
              </DashboardCard>
              <DashboardCard>
                <p className="text-sm font-semibold text-[var(--ink)]">Angles</p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  {angles.length ? angles.map((p, i) => <li key={i}>• {p}</li>) : <li>No angles.</li>}
                </ul>
              </DashboardCard>
              <DashboardCard>
                <p className="text-sm font-semibold text-[var(--ink)]">Offers</p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  {offers.length ? offers.map((p, i) => <li key={i}>• {p}</li>) : <li>No offers.</li>}
                </ul>
              </DashboardCard>
              <DashboardCard>
                <p className="text-sm font-semibold text-[var(--ink)]">Callouts</p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  {callouts.length ? callouts.map((p, i) => <li key={i}>• {p}</li>) : <li>No callouts.</li>}
                </ul>
              </DashboardCard>
              <DashboardCard className="md:col-span-2">
                <p className="text-sm font-semibold text-[var(--ink)]">Scripts</p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  {scripts.length ? scripts.map((p, i) => <li key={i}>• {p}</li>) : <li>No scripts.</li>}
                </ul>
              </DashboardCard>
            </div>
          )}
        </div>
      )}

      {activeTab === "Copywriting" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <SectionHeader
              title="Copywriting"
              description="Long-form content generated from market signals and campaigns."
            />
            <GhostButton onClick={generateCopy}>Generate Copy</GhostButton>
          </div>
          {copies.length === 0 ? (
            <DashboardCard>
              <p className="text-sm text-[var(--muted)]">
                No copy generated yet. Run Parasite and Campaigns first, then generate copy.
              </p>
            </DashboardCard>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <DashboardCard>
                <p className="text-sm font-semibold text-[var(--ink)]">Landing Page Sections</p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  {landingPageSections.length
                    ? landingPageSections.map((sec, i) => (
                        <li key={i}>
                          <span className="font-semibold text-[var(--ink)]">{sec.title}: </span>
                          <span>{sec.body}</span>
                        </li>
                      ))
                    : <li>No sections.</li>}
                </ul>
              </DashboardCard>
              <DashboardCard>
                <p className="text-sm font-semibold text-[var(--ink)]">Long Form Script</p>
                <p className="mt-2 text-sm text-[var(--muted)] whitespace-pre-line">
                  {longFormScript || "No script."}
                </p>
              </DashboardCard>
              <DashboardCard>
                <p className="text-sm font-semibold text-[var(--ink)]">Email Variants</p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  {emailVariants.length ? emailVariants.map((p, i) => <li key={i}>• {p}</li>) : <li>No emails.</li>}
                </ul>
              </DashboardCard>
              <DashboardCard>
                <p className="text-sm font-semibold text-[var(--ink)]">Ad Variants</p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  {adVariants.length ? adVariants.map((p, i) => <li key={i}>• {p}</li>) : <li>No ads.</li>}
                </ul>
              </DashboardCard>
              <DashboardCard className="md:col-span-2">
                <p className="text-sm font-semibold text-[var(--ink)]">Social Posts</p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                  {socialPosts.length ? socialPosts.map((p, i) => <li key={i}>• {p}</li>) : <li>No posts.</li>}
                </ul>
              </DashboardCard>
            </div>
          )}
        </div>
      )}

      {activeTab === "Market Twin" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <SectionHeader
              title="Market Twin"
              description="Benchmarks and percentiles for your niche and region."
            />
            <GhostButton onClick={runMarketTwin}>Run Market Twin</GhostButton>
          </div>

          {twinEntries.length === 0 ? (
            <DashboardCard>
              <p className="text-sm text-[var(--muted)]">No benchmarks yet. Run Market Twin to see how you compare.</p>
            </DashboardCard>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <DashboardCard>
                <p className="text-sm font-semibold text-[var(--ink)]">Price Percentile</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {pricePercentile !== null ? `${pricePercentile}` : "No data"}
                </p>
              </DashboardCard>
              <DashboardCard>
                <p className="text-sm font-semibold text-[var(--ink)]">CTA Strength Percentile</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {ctaStrengthPercentile !== null ? `${ctaStrengthPercentile}` : "No data"}
                </p>
              </DashboardCard>
              <DashboardCard>
                <p className="text-sm font-semibold text-[var(--ink)]">Review Quality Percentile</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {reviewQualityPercentile !== null ? `${reviewQualityPercentile}` : "No data"}
                </p>
              </DashboardCard>
              <DashboardCard>
                <p className="text-sm font-semibold text-[var(--ink)]">Competition Level</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {competitionLevel || "No data"}
                </p>
              </DashboardCard>
              <DashboardCard className="md:col-span-2">
                <p className="text-sm font-semibold text-[var(--ink)]">Growth Direction</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {growthDirection || "No data"}
                </p>
              </DashboardCard>
            </div>
          )}
        </div>
      )}

      {activeTab === "Automations" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <SectionHeader
              title="Automations"
              description="Recommended actions based on signals, campaigns and benchmarks."
            />
            <GhostButton onClick={runPlaybooks}>Run Playbooks</GhostButton>
          </div>

          {playbooks.length === 0 ? (
            <DashboardCard>
              <p className="text-sm text-[var(--muted)]">
                No playbooks yet. Run Parasite, Campaigns and Market Twin first, then run Playbooks.
              </p>
            </DashboardCard>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {actions.map((action: any, idx: number) => (
                <DashboardCard key={idx}>
                  <p className="text-sm font-semibold text-[var(--ink)]">{action.label || "Recommended action"}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {action.type ? `Type: ${action.type}. ` : ""}
                    {action.confidence ? `Confidence: ${action.confidence}.` : ""}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {action.reason || "No detailed reason available."}
                  </p>
                </DashboardCard>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "Config" && (
        <DashboardCard className="space-y-2">
          <p className="text-sm font-semibold text-[var(--ink)]">Config</p>
          <pre className="overflow-auto rounded-[var(--radius-sm)] bg-[var(--surface-muted)] p-3 text-xs text-[var(--ink)]">
            {robot ? JSON.stringify(robot.config, null, 2) : "No config"}
          </pre>
        </DashboardCard>
      )}

      <Divider />

      <DashboardCard>
        <p className="text-sm font-semibold text-[var(--ink)]">Templates</p>
        <p className="text-sm text-[var(--muted)]">Apply extraction and execution templates to accelerate this bot.</p>
        <div className="mt-3 flex gap-2">
          <GhostButton asChild>
            <Link href="/app/robots/templates">Open templates</Link>
          </GhostButton>
          <GhostButton asChild>
            <Link href="/app/robots">Back to list</Link>
          </GhostButton>
        </div>
      </DashboardCard>
    </div>
  );
}
