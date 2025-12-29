"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, FormEvent } from "react";
import { PageHeader } from "@/components/dashboard/layout/PageHeader";
import { SectionHeader } from "@/components/dashboard/layout/SectionHeader";
import { DataTable } from "@/components/dashboard/data/DataTable";
import { Divider } from "@/components/dashboard/sections/Divider";
import { GhostButton } from "@/components/ui/GhostButton";
import { DashboardCard } from "@/components/dashboard/cards/DashboardCard";
import type { ExecutionVisibilityOutput } from "@/lib/contracts/execution-visibility";

const tabs = [
  "Overview",
  "Competitors",
  "Fusion",
  "Execution Playbooks",
  "Insights",
  "Campaigns",
  "Copywriting",
  "Market Twin",
  "Automations",
  "Config",
] as const;

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

type CompetitorInsight = {
  id: string;
  createdAt: string;
  summaryJson: any;
};

type CompetitorProfile = {
  id: string;
  name: string;
  url: string;
  reviewsUrl?: string | null;
  createdAt?: string;
  insights?: CompetitorInsight[];
};

type FusionSummary = {
  commonComplaints: string[];
  commonPraises: string[];
  uniqueStrengths: Record<string, string[]>;
  opportunities: string[];
};

type PlaybookTask = {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: number;
  createdAt: string;
};

type PlaybookV2 = {
  id: string;
  type: string;
  title: string;
  structure: any;
  createdAt: string;
  tasks?: PlaybookTask[];
};

type PlaybookType = "google_ads" | "meta_ads" | "seo" | "landing" | "video";

export default function RobotConsolePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Overview");
  const [robot, setRobot] = useState<Robot | null>(null);
  const [loading, setLoading] = useState(false);
  const [runs, setRuns] = useState<RobotRun[]>([]);
  const [ideas, setIdeas] = useState<RobotIdea[]>([]);
  const [copies, setCopies] = useState<RobotCopy[]>([]);
  const [twinEntries, setTwinEntries] = useState<MarketTwinEntry[]>([]);
  const [playbooks, setPlaybooks] = useState<RobotPlaybook[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorProfile[]>([]);
  const [competitorForm, setCompetitorForm] = useState({
    name: "",
    url: "",
    reviewsUrl: "",
  });
  const [savingCompetitor, setSavingCompetitor] = useState(false);
  const [fusionSummary, setFusionSummary] = useState<FusionSummary | null>(null);
  const [fusionRunning, setFusionRunning] = useState(false);
  const [insightsRunning, setInsightsRunning] = useState(false);
  const [playbooksV2, setPlaybooksV2] = useState<Record<string, PlaybookV2[]>>({});
  const [playbooksV2Loading, setPlaybooksV2Loading] = useState(false);
  const [activePlaybookTab, setActivePlaybookTab] = useState<PlaybookType>("google_ads");
  const [visibility, setVisibility] = useState<ExecutionVisibilityOutput | null>(null);
  const [visibilityUnavailable, setVisibilityUnavailable] = useState(false);
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

  const playbookTaskColumns = useMemo(
    () => [
      { key: "priority", label: "Priority" },
      { key: "title", label: "Task" },
      { key: "category", label: "Category" },
      { key: "description", label: "Description" },
    ],
    [],
  );

  const seoColumns = useMemo(
    () => [
      { key: "keyword", label: "Keyword" },
      { key: "intent", label: "Intent" },
    ],
    [],
  );

  const playbookTabs: Array<{ key: PlaybookType; label: string }> = [
    { key: "google_ads", label: "Google Ads" },
    { key: "meta_ads", label: "Meta Ads" },
    { key: "seo", label: "SEO" },
    { key: "landing", label: "Landing" },
    { key: "video", label: "Video" },
  ];

  const loadCompetitors = async () => {
    const competitorsRes = await fetch(`/api/robots/${params.id}/competitors`).catch(() => null);
    const competitorsJson = await competitorsRes?.json().catch(() => null);
    setCompetitors(competitorsJson?.data ?? []);
  };

  const loadFusion = async () => {
    const fusionRes = await fetch(`/api/robots/${params.id}/fusion`).catch(() => null);
    const fusionJson = await fusionRes?.json().catch(() => null);
    setFusionSummary(fusionJson?.data?.summaryJson ?? null);
  };

  const loadPlaybooksV2 = async () => {
    const playbooksRes = await fetch(`/api/robots/${params.id}/playbooks-v2/list`).catch(() => null);
    const playbooksJson = await playbooksRes?.json().catch(() => null);
    setPlaybooksV2(playbooksJson?.data ?? {});
  };

  const loadVisibility = async () => {
    const visibilityRes = await fetch(`/api/robots/${params.id}/visibility`).catch(() => null);
    const visibilityJson = await visibilityRes?.json().catch(() => null);
    if (visibilityRes?.ok && visibilityJson?.ok) {
      setVisibility(visibilityJson);
      setVisibilityUnavailable(false);
      return;
    }
    setVisibility(null);
    setVisibilityUnavailable(true);
  };

  const toList = (value: any): string[] =>
    Array.isArray(value) ? value.filter((item) => typeof item === "string" && item.trim().length > 0) : [];

  const renderList = (items: string[], emptyLabel: string) => (
    <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
      {items.length ? items.map((item, idx) => <li key={idx}>• {item}</li>) : <li>{emptyLabel}</li>}
    </ul>
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
      await loadCompetitors();
      await loadFusion();
      await loadPlaybooksV2();
      await loadVisibility();
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

  const runPlaybooksV2 = async () => {
    if (playbooksV2Loading) return;
    setPlaybooksV2Loading(true);
    await fetch(`/api/robots/${params.id}/playbooks-v2/run`, { method: "POST" }).catch(() => null);
    await loadPlaybooksV2();
    setPlaybooksV2Loading(false);
  };

  const addCompetitor = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (savingCompetitor) return;
    setSavingCompetitor(true);
    const payload = {
      name: competitorForm.name.trim(),
      url: competitorForm.url.trim(),
      reviewsUrl: competitorForm.reviewsUrl.trim() || undefined,
    };
    await fetch(`/api/robots/${params.id}/competitors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);
    setCompetitorForm({ name: "", url: "", reviewsUrl: "" });
    await loadCompetitors();
    setSavingCompetitor(false);
  };

  const runCompetitorInsights = async () => {
    if (insightsRunning) return;
    setInsightsRunning(true);
    await fetch(`/api/robots/${params.id}/competitors/run-insights`, {
      method: "POST",
    }).catch(() => null);
    await loadCompetitors();
    setInsightsRunning(false);
  };

  const runFusion = async () => {
    if (fusionRunning) return;
    setFusionRunning(true);
    const res = await fetch(`/api/robots/${params.id}/fusion/run`, { method: "POST" }).catch(() => null);
    const json = await res?.json().catch(() => null);
    setFusionSummary(json?.data ?? null);
    await loadFusion();
    setFusionRunning(false);
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

  const fusedComplaints = toList(fusionSummary?.commonComplaints);
  const fusedPraises = toList(fusionSummary?.commonPraises);
  const fusedOpportunities = toList(fusionSummary?.opportunities);
  const fusedUniqueStrengths =
    fusionSummary?.uniqueStrengths && typeof fusionSummary.uniqueStrengths === "object"
      ? Object.entries(fusionSummary.uniqueStrengths)
      : [];

  const activePlaybook = playbooksV2[activePlaybookTab]?.[0] ?? null;
  const activeStructure = activePlaybook?.structure ?? {};
  const playbookTasks = Array.isArray(activePlaybook?.tasks) ? activePlaybook?.tasks ?? [] : [];
  const playbookTaskRows = playbookTasks.map((task) => ({
    priority: task.priority,
    title: task.title,
    category: task.category,
    description: task.description,
  }));
  const googleCampaigns = Array.isArray(activeStructure?.campaigns) ? activeStructure.campaigns : [];
  const metaFunnels = typeof activeStructure?.funnels === "object" && activeStructure?.funnels ? activeStructure.funnels : {};
  const seoPillar = typeof activeStructure?.pillar === "string" ? activeStructure.pillar : "";
  const seoClusters = Array.isArray(activeStructure?.clusters) ? activeStructure.clusters : [];
  const seoRows = seoClusters.map((cluster, idx) => ({
    keyword: typeof cluster?.keyword === "string" ? cluster.keyword : `Cluster ${idx + 1}`,
    intent: typeof cluster?.intent === "string" ? cluster.intent : "unknown",
  }));
  const landingSections = toList(activeStructure?.sections);
  const landingNotes = toList(activeStructure?.copyNotes);
  const videoScripts = Array.isArray(activeStructure?.scripts) ? activeStructure.scripts : [];
  const coldAngles = toList(metaFunnels?.cold?.angles);
  const coldCreatives = toList(metaFunnels?.cold?.creatives);
  const warmRetargeting = toList(metaFunnels?.warm?.retargeting);
  const bofOffer = typeof metaFunnels?.bof?.offer === "string" ? metaFunnels.bof.offer : "";

  type VisibilityAction = ExecutionVisibilityOutput["nextActions"][number]["action"];
  type VisibilityModuleKey = keyof ExecutionVisibilityOutput["lastExecutionByModule"];
  type VisibilityGateType = ExecutionVisibilityOutput["gates"][number]["gateType"];

  const resolveActionHint = (
    action: VisibilityAction,
    moduleKey: VisibilityModuleKey,
    gateType?: VisibilityGateType,
  ) => {
    if (!visibility) {
      return { enabled: true, message: "Execution state unavailable" };
    }

    const recommended = visibility.nextActions.find((item) => item.action === action);
    if (recommended) {
      return { enabled: true, message: recommended.rationale };
    }

    const gate = gateType ? visibility.gates.find((item) => item.gateType === gateType) : undefined;
    if (gate) {
      const prefix = gate.state === "failed" ? "Blocked by Policy: " : "Deferred by Policy: ";
      return { enabled: false, message: `${prefix}${gate.message}` };
    }

    const last = visibility.lastExecutionByModule[moduleKey];
    if (last.status === "never_ran") {
      return { enabled: false, message: "Module never ran" };
    }
    if (last.status === "failed") {
      return { enabled: false, message: `Last run failed: ${last.lastReason ?? "unknown"}` };
    }
    if (last.status === "cancelled") {
      return { enabled: false, message: `Last run cancelled: ${last.lastReason ?? "cancelled"}` };
    }
    if (last.status === "succeeded") {
      return { enabled: false, message: "Last run succeeded; no action required" };
    }
    return { enabled: false, message: "Execution not recommended" };
  };

  const runRobotHint = resolveActionHint("robots.run", "robots", "robots_run_gate");
  const runInsightsHint = resolveActionHint("competitors.run_insights", "competitors");
  const runFusionHint = resolveActionHint("fusion.run", "fusion", "fusion_gate");
  const generateIdeaHint = resolveActionHint("ideator.run", "ideator", "ideator_gate");
  const generateCopyHint = resolveActionHint("copywriter.run", "copywriter", "copywriter_gate");
  const runMarketTwinHint = resolveActionHint("market_twin.run", "market_twin", "market_twin_gate");
  const runPlaybooksHint = resolveActionHint("playbooks.v1.run", "playbooks_v1", "playbooks_v1_gate");
  const runPlaybooksV2Hint = resolveActionHint("playbooks.v2.run", "playbooks_v2", "playbooks_v2_gate");

  return (
    <div className="space-y-6">
      <PageHeader
        title={robot ? robot.name : `Robot Console — ${params.id}`}
        subtitle="Manage scans, signals and configuration."
        actions={
          <div className="flex flex-wrap items-start gap-3">
            <div className="flex flex-col items-start gap-1">
              <GhostButton onClick={runRobot} disabled={!runRobotHint.enabled}>
                Run Parasite
              </GhostButton>
              <p className="text-xs text-[var(--muted)]">{runRobotHint.message}</p>
            </div>
            <GhostButton asChild>
              <Link href="/app/robots">Back to list</Link>
            </GhostButton>
          </div>
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

      {activeTab === "Competitors" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SectionHeader
              title="Competitors"
              description="Track rival businesses and collect review signals."
            />
            <div className="flex flex-col items-end gap-1">
              <GhostButton
                onClick={runCompetitorInsights}
                disabled={!runInsightsHint.enabled || insightsRunning}
              >
                {insightsRunning ? "Running..." : "Run Insights"}
              </GhostButton>
              <p className="text-xs text-[var(--muted)]">
                {visibilityUnavailable ? "Execution state unavailable" : runInsightsHint.message}
              </p>
            </div>
          </div>
          <DashboardCard>
            <form onSubmit={addCompetitor} className="space-y-3">
              <div className="grid gap-3 md:grid-cols-3">
                <label className="text-sm text-[var(--muted)]">
                  Name
                  <input
                    className="mt-1 w-full rounded-[var(--radius-sm)] border px-3 py-2 text-sm"
                    style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
                    value={competitorForm.name}
                    onChange={(e) => setCompetitorForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </label>
                <label className="text-sm text-[var(--muted)]">
                  Website URL
                  <input
                    className="mt-1 w-full rounded-[var(--radius-sm)] border px-3 py-2 text-sm"
                    style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
                    value={competitorForm.url}
                    onChange={(e) => setCompetitorForm((prev) => ({ ...prev, url: e.target.value }))}
                    required
                  />
                </label>
                <label className="text-sm text-[var(--muted)]">
                  Reviews URL (optional)
                  <input
                    className="mt-1 w-full rounded-[var(--radius-sm)] border px-3 py-2 text-sm"
                    style={{ borderColor: "var(--line)", backgroundColor: "var(--surface)" }}
                    value={competitorForm.reviewsUrl}
                    onChange={(e) => setCompetitorForm((prev) => ({ ...prev, reviewsUrl: e.target.value }))}
                  />
                </label>
              </div>
              <div className="flex justify-end">
                <GhostButton
                  type="submit"
                  disabled={
                    savingCompetitor ||
                    competitorForm.name.trim().length === 0 ||
                    competitorForm.url.trim().length === 0
                  }
                >
                  {savingCompetitor ? "Saving..." : "Add competitor"}
                </GhostButton>
              </div>
            </form>
          </DashboardCard>

          {competitors.length === 0 ? (
            <DashboardCard>
              <p className="text-sm text-[var(--muted)]">No competitors yet. Add one to start tracking.</p>
            </DashboardCard>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {competitors.map((competitor) => {
                const summary = competitor.insights?.[0]?.summaryJson ?? null;
                const positives = toList(summary?.positives);
                const negatives = toList(summary?.negatives);
                const themes = toList(summary?.themes);
                const source = typeof summary?.source === "string" ? summary.source : "";

                return (
                  <DashboardCard key={competitor.id} className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[var(--ink)]">{competitor.name}</p>
                      <p className="text-xs text-[var(--muted)]">{competitor.url}</p>
                      {competitor.reviewsUrl ? (
                        <p className="text-xs text-[var(--muted)]">Reviews: {competitor.reviewsUrl}</p>
                      ) : null}
                    </div>

                    {!summary ? (
                      <p className="text-sm text-[var(--muted)]">No review insights yet.</p>
                    ) : (
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold text-[var(--ink)]">Positives</p>
                          {renderList(positives, "No positives captured.")}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[var(--ink)]">Negatives</p>
                          {renderList(negatives, "No negatives captured.")}
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-xs font-semibold text-[var(--ink)]">Themes</p>
                          {renderList(themes, "No themes captured.")}
                        </div>
                        {source ? (
                          <div className="md:col-span-2 text-xs text-[var(--muted)]">
                            Source: {source}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </DashboardCard>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "Fusion" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SectionHeader
              title="Fusion"
              description="Merge competitor review signals into a unified view."
            />
            <div className="flex flex-col items-end gap-1">
              <GhostButton onClick={runFusion} disabled={!runFusionHint.enabled || fusionRunning}>
                {fusionRunning ? "Running..." : "Run Fusion"}
              </GhostButton>
              <p className="text-xs text-[var(--muted)]">
                {visibilityUnavailable ? "Execution state unavailable" : runFusionHint.message}
              </p>
            </div>
          </div>

          {competitors.length === 0 ? (
            <DashboardCard>
              <p className="text-sm text-[var(--muted)]">Add competitors before running fusion.</p>
            </DashboardCard>
          ) : !fusionSummary ? (
            <DashboardCard>
              <p className="text-sm text-[var(--muted)]">No fusion run yet. Click Run Fusion to create one.</p>
            </DashboardCard>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <DashboardCard>
                <p className="text-sm font-semibold text-[var(--ink)]">Common complaints</p>
                {renderList(fusedComplaints, "No common complaints yet.")}
              </DashboardCard>
              <DashboardCard>
                <p className="text-sm font-semibold text-[var(--ink)]">Common praises</p>
                {renderList(fusedPraises, "No common praises yet.")}
              </DashboardCard>
              <DashboardCard className="md:col-span-2">
                <p className="text-sm font-semibold text-[var(--ink)]">Unique strengths</p>
                <div className="mt-2 space-y-3">
                  {fusedUniqueStrengths.length ? (
                    fusedUniqueStrengths.map(([label, strengths]) => (
                      <div key={label}>
                        <p className="text-xs font-semibold text-[var(--ink)]">{label}</p>
                        {renderList(toList(strengths), "No strengths captured.")}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[var(--muted)]">No unique strengths captured.</p>
                  )}
                </div>
              </DashboardCard>
              <DashboardCard className="md:col-span-2">
                <p className="text-sm font-semibold text-[var(--ink)]">Opportunities</p>
                {renderList(fusedOpportunities, "No opportunities captured yet.")}
              </DashboardCard>
            </div>
          )}
        </div>
      )}

      {activeTab === "Execution Playbooks" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SectionHeader
              title="Execution Playbooks"
              description="Turn intelligence into structured execution plans."
            />
            <div className="flex flex-col items-end gap-1">
              <GhostButton onClick={runPlaybooksV2} disabled={!runPlaybooksV2Hint.enabled || playbooksV2Loading}>
                {playbooksV2Loading ? "Generating..." : "Generate Playbooks v2"}
              </GhostButton>
              <p className="text-xs text-[var(--muted)]">
                {visibilityUnavailable ? "Execution state unavailable" : runPlaybooksV2Hint.message}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {playbookTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActivePlaybookTab(tab.key)}
                className={`rounded-[var(--radius-sm)] px-3 py-1.5 text-sm ${
                  activePlaybookTab === tab.key ? "bg-[var(--surface-muted)] text-[var(--ink)]" : "text-[var(--muted)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {!activePlaybook ? (
            <DashboardCard>
              <p className="text-sm text-[var(--muted)]">No playbooks generated yet. Run Playbooks v2 to begin.</p>
            </DashboardCard>
          ) : (
            <div className="space-y-4">
              {activePlaybookTab === "google_ads" && (
                <div className="grid gap-3 md:grid-cols-2">
                  {googleCampaigns.length ? (
                    googleCampaigns.map((campaign: any, idx: number) => {
                      const adGroups = Array.isArray(campaign?.structure?.adGroups)
                        ? campaign.structure.adGroups
                        : [];

                      return (
                        <DashboardCard key={`${campaign?.name ?? "campaign"}-${idx}`} className="space-y-2">
                          <div>
                            <p className="text-sm font-semibold text-[var(--ink)]">{campaign?.name ?? "Campaign"}</p>
                            <p className="text-xs text-[var(--muted)]">Goal: {campaign?.goal ?? "Leads"}</p>
                          </div>
                          {adGroups.length ? (
                            <div className="space-y-3">
                              {adGroups.map((group: any, groupIdx: number) => (
                                <div key={`${group?.name ?? "group"}-${groupIdx}`} className="space-y-2">
                                  <p className="text-xs font-semibold text-[var(--ink)]">Ad Group: {group?.name ?? "Group"}</p>
                                  <div>
                                    <p className="text-xs font-semibold text-[var(--ink)]">Keywords</p>
                                    {renderList(toList(group?.keywords), "No keywords captured.")}
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-[var(--ink)]">Ads</p>
                                    <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
                                      {Array.isArray(group?.ads) && group.ads.length ? (
                                        group.ads.map((ad: any, adIdx: number) => (
                                          <li key={`${ad?.headline ?? "ad"}-${adIdx}`}>
                                            • {ad?.headline ?? "Headline"} — {ad?.description ?? "Description"}
                                          </li>
                                        ))
                                      ) : (
                                        <li>No ads captured.</li>
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-[var(--muted)]">No ad groups captured.</p>
                          )}
                        </DashboardCard>
                      );
                    })
                  ) : (
                    <DashboardCard>
                      <p className="text-sm text-[var(--muted)]">No campaigns captured.</p>
                    </DashboardCard>
                  )}
                </div>
              )}

              {activePlaybookTab === "meta_ads" && (
                <div className="grid gap-3 md:grid-cols-3">
                  <DashboardCard>
                    <p className="text-sm font-semibold text-[var(--ink)]">Cold</p>
                    <div className="mt-2 space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-[var(--ink)]">Angles</p>
                        {renderList(coldAngles, "No angles captured.")}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[var(--ink)]">Creatives</p>
                        {renderList(coldCreatives, "No creatives captured.")}
                      </div>
                    </div>
                  </DashboardCard>
                  <DashboardCard>
                    <p className="text-sm font-semibold text-[var(--ink)]">Warm</p>
                    <div className="mt-2 space-y-2">
                      <p className="text-xs font-semibold text-[var(--ink)]">Retargeting</p>
                      {renderList(warmRetargeting, "No retargeting audiences captured.")}
                    </div>
                  </DashboardCard>
                  <DashboardCard>
                    <p className="text-sm font-semibold text-[var(--ink)]">Bottom of Funnel</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">{bofOffer || "No offer captured."}</p>
                  </DashboardCard>
                </div>
              )}

              {activePlaybookTab === "seo" && (
                <div className="space-y-3">
                  <DashboardCard>
                    <p className="text-sm font-semibold text-[var(--ink)]">Pillar</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">{seoPillar || "No pillar captured."}</p>
                  </DashboardCard>
                  {seoRows.length ? (
                    <DataTable columns={seoColumns} rows={seoRows} />
                  ) : (
                    <DashboardCard>
                      <p className="text-sm text-[var(--muted)]">No SEO clusters captured.</p>
                    </DashboardCard>
                  )}
                </div>
              )}

              {activePlaybookTab === "landing" && (
                <div className="grid gap-3 md:grid-cols-2">
                  <DashboardCard>
                    <p className="text-sm font-semibold text-[var(--ink)]">Sections</p>
                    {renderList(landingSections, "No sections captured.")}
                  </DashboardCard>
                  <DashboardCard>
                    <p className="text-sm font-semibold text-[var(--ink)]">Copy Notes</p>
                    {renderList(landingNotes, "No copy notes captured.")}
                  </DashboardCard>
                </div>
              )}

              {activePlaybookTab === "video" && (
                <div className="grid gap-3 md:grid-cols-2">
                  {videoScripts.length ? (
                    videoScripts.map((script: any, idx: number) => (
                      <DashboardCard key={`${script?.format ?? "script"}-${idx}`}>
                        <p className="text-sm font-semibold text-[var(--ink)]">
                          {script?.format ?? "Script"} format
                        </p>
                        <p className="mt-2 text-sm text-[var(--muted)]">Hook: {script?.hook ?? "No hook captured."}</p>
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-[var(--ink)]">Structure</p>
                          {renderList(toList(script?.structure), "No structure captured.")}
                        </div>
                      </DashboardCard>
                    ))
                  ) : (
                    <DashboardCard>
                      <p className="text-sm text-[var(--muted)]">No scripts captured.</p>
                    </DashboardCard>
                  )}
                </div>
              )}

              <DashboardCard>
                <p className="text-sm font-semibold text-[var(--ink)]">Task Pipeline</p>
                <div className="mt-3">
                  {playbookTaskRows.length ? (
                    <DataTable columns={playbookTaskColumns} rows={playbookTaskRows} />
                  ) : (
                    <p className="text-sm text-[var(--muted)]">No tasks captured.</p>
                  )}
                </div>
              </DashboardCard>
            </div>
          )}
        </div>
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
                  actions: (
                    <div className="flex flex-col items-end gap-1">
                      <GhostButton onClick={runRobot} disabled={!runRobotHint.enabled}>
                        Run now
                      </GhostButton>
                      <span className="text-xs text-[var(--muted)]">{runRobotHint.message}</span>
                    </div>
                  ),
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
            <div className="flex flex-col items-end gap-1">
              <GhostButton onClick={generateIdea} disabled={!generateIdeaHint.enabled}>
                Generate Campaign
              </GhostButton>
              <p className="text-xs text-[var(--muted)]">
                {visibilityUnavailable ? "Execution state unavailable" : generateIdeaHint.message}
              </p>
            </div>
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
            <div className="flex flex-col items-end gap-1">
              <GhostButton onClick={generateCopy} disabled={!generateCopyHint.enabled}>
                Generate Copy
              </GhostButton>
              <p className="text-xs text-[var(--muted)]">
                {visibilityUnavailable ? "Execution state unavailable" : generateCopyHint.message}
              </p>
            </div>
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
            <div className="flex flex-col items-end gap-1">
              <GhostButton onClick={runMarketTwin} disabled={!runMarketTwinHint.enabled}>
                Run Market Twin
              </GhostButton>
              <p className="text-xs text-[var(--muted)]">
                {visibilityUnavailable ? "Execution state unavailable" : runMarketTwinHint.message}
              </p>
            </div>
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
            <div className="flex flex-col items-end gap-1">
              <GhostButton onClick={runPlaybooks} disabled={!runPlaybooksHint.enabled}>
                Run Playbooks
              </GhostButton>
              <p className="text-xs text-[var(--muted)]">
                {visibilityUnavailable ? "Execution state unavailable" : runPlaybooksHint.message}
              </p>
            </div>
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
