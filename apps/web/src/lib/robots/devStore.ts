type DevRobot = {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  config: any;
  status: string;
  createdAt: string;
  updatedAt: string;
  devTemporary: boolean;
};

type DevCompetitor = {
  id: string;
  robotId: string;
  name: string;
  url: string;
  reviewsUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

type DevInsight = {
  id: string;
  competitorId: string;
  summaryJson: any;
  createdAt: string;
};

type DevFusion = {
  id: string;
  robotId: string;
  name: string;
  summaryJson: any;
  createdAt: string;
};

type DevPlaybook = {
  id: string;
  robotId: string;
  type: string;
  title: string;
  structure: any;
  createdAt: string;
};

type DevTask = {
  id: string;
  playbookId: string;
  category: string;
  title: string;
  description: string;
  priority: number;
  createdAt: string;
};

type DevStore = {
  robots: DevRobot[];
  competitors: DevCompetitor[];
  insights: DevInsight[];
  fusions: DevFusion[];
  playbooks: DevPlaybook[];
  tasks: DevTask[];
};

const globalForDev = globalThis as typeof globalThis & { __crealephDevStore?: DevStore };

const initStore = (): DevStore => ({
  robots: [],
  competitors: [],
  insights: [],
  fusions: [],
  playbooks: [],
  tasks: [],
});

export const devStore = globalForDev.__crealephDevStore ?? initStore();
if (!globalForDev.__crealephDevStore) {
  globalForDev.__crealephDevStore = devStore;
}

const now = () => new Date().toISOString();

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const isDbConnectionError = (error: unknown) => {
  const message = String((error as any)?.message ?? error);
  const code = (error as any)?.code;
  return (
    code === "P1001" ||
    message.includes("ECONNREFUSED") ||
    message.toLowerCase().includes("can't reach database") ||
    message.toLowerCase().includes("connection refused")
  );
};

export const createDevRobot = (tenantId: string, name: string, type: string, config: any) => {
  const robot: DevRobot = {
    id: createId("dev-robot"),
    tenantId,
    name,
    type,
    config,
    status: "active",
    createdAt: now(),
    updatedAt: now(),
    devTemporary: true,
  };
  devStore.robots.unshift(robot);
  return robot;
};

export const listDevRobots = (tenantId: string) =>
  devStore.robots.filter((robot) => robot.tenantId === tenantId);

export const getDevRobot = (tenantId: string, robotId: string) =>
  devStore.robots.find((robot) => robot.id === robotId && robot.tenantId === tenantId) ?? null;

export const createDevCompetitor = (robotId: string, name: string, url: string, reviewsUrl?: string | null) => {
  const competitor: DevCompetitor = {
    id: createId("dev-competitor"),
    robotId,
    name,
    url,
    reviewsUrl: reviewsUrl ?? null,
    createdAt: now(),
    updatedAt: now(),
  };
  devStore.competitors.unshift(competitor);
  return competitor;
};

export const listDevCompetitors = (robotId: string) => {
  const competitors = devStore.competitors.filter((competitor) => competitor.robotId === robotId);
  return competitors.map((competitor) => ({
    ...competitor,
    insights: listLatestInsightForCompetitor(competitor.id),
  }));
};

const listLatestInsightForCompetitor = (competitorId: string) => {
  const insights = devStore.insights
    .filter((insight) => insight.competitorId === competitorId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return insights.length ? [insights[0]] : [];
};

export const deleteDevCompetitor = (competitorId: string) => {
  devStore.competitors = devStore.competitors.filter((competitor) => competitor.id !== competitorId);
  devStore.insights = devStore.insights.filter((insight) => insight.competitorId !== competitorId);
};

export const createDevInsight = (competitorId: string, summaryJson: any) => {
  const insight: DevInsight = {
    id: createId("dev-insight"),
    competitorId,
    summaryJson,
    createdAt: now(),
  };
  devStore.insights.unshift(insight);
  return insight;
};

export const listDevInsightsByRobot = (robotId: string) => {
  const competitorIds = devStore.competitors
    .filter((competitor) => competitor.robotId === robotId)
    .map((competitor) => competitor.id);
  return devStore.insights.filter((insight) => competitorIds.includes(insight.competitorId));
};

export const createDevFusion = (robotId: string, name: string, summaryJson: any) => {
  const fusion: DevFusion = {
    id: createId("dev-fusion"),
    robotId,
    name,
    summaryJson,
    createdAt: now(),
  };
  devStore.fusions.unshift(fusion);
  return fusion;
};

export const getLatestDevFusion = (robotId: string) =>
  devStore.fusions.find((fusion) => fusion.robotId === robotId) ?? null;

export const createDevPlaybook = (robotId: string, type: string, title: string, structure: any) => {
  const playbook: DevPlaybook = {
    id: createId("dev-playbook"),
    robotId,
    type,
    title,
    structure,
    createdAt: now(),
  };
  devStore.playbooks.unshift(playbook);
  return playbook;
};

export const listDevPlaybooks = (robotId: string) =>
  devStore.playbooks.filter((playbook) => playbook.robotId === robotId);

export const createDevTasks = (playbookId: string, tasks: Omit<DevTask, "id" | "playbookId" | "createdAt">[]) => {
  const created = tasks.map((task) => ({
    id: createId("dev-task"),
    playbookId,
    createdAt: now(),
    ...task,
  }));
  devStore.tasks.push(...created);
  return created;
};

export const listDevTasksByPlaybookIds = (playbookIds: string[]) =>
  devStore.tasks.filter((task) => playbookIds.includes(task.playbookId));
