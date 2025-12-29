import { NextResponse } from "next/server";
import { prisma } from "@crealeph/db";
import {
  getDevRobot,
  isDbConnectionError,
  listDevPlaybooks,
  listDevTasksByPlaybookIds,
} from "@/lib/robots/devStore";

function getTenantId() {
  return process.env.DEFAULT_TENANT_ID ?? "demo-tenant";
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const robotId = params.id;
  if (!robotId) return NextResponse.json({ ok: false, message: "id required" }, { status: 400 });
  const tenantId = getTenantId();

  try {
    const robot = await prisma.robot.findFirst({ where: { id: robotId, tenantId } });
    if (!robot) return NextResponse.json({ ok: false, message: "not found" }, { status: 404 });

    const playbooks = await prisma.robotPlaybookV2.findMany({
      where: { robotId: robot.id },
      orderBy: { createdAt: "desc" },
    });

    const playbookIds = playbooks.map((playbook) => playbook.id);
    const tasks = playbookIds.length
      ? await prisma.playbookTask.findMany({
          where: { playbookId: { in: playbookIds } },
          orderBy: { priority: "asc" },
        })
      : [];

    const tasksByPlaybook = tasks.reduce<Record<string, typeof tasks>>((acc, task) => {
      if (!acc[task.playbookId]) acc[task.playbookId] = [];
      acc[task.playbookId].push(task);
      return acc;
    }, {});

    const grouped = playbooks.reduce<Record<string, Array<Record<string, unknown>>>>((acc, playbook) => {
      const entry = { ...playbook, tasks: tasksByPlaybook[playbook.id] ?? [] };
      if (!acc[playbook.type]) acc[playbook.type] = [];
      acc[playbook.type].push(entry);
      return acc;
    }, {});

    return NextResponse.json({ ok: true, data: grouped });
  } catch (error) {
    if (isDbConnectionError(error)) {
      const robot = getDevRobot(tenantId, robotId);
      if (!robot) return NextResponse.json({ ok: false, message: "not found" }, { status: 404 });

      const playbooks = listDevPlaybooks(robotId);
      const playbookIds = playbooks.map((playbook) => playbook.id);
      const tasks = playbookIds.length ? listDevTasksByPlaybookIds(playbookIds) : [];

      const tasksByPlaybook = tasks.reduce<Record<string, typeof tasks>>((acc, task) => {
        if (!acc[task.playbookId]) acc[task.playbookId] = [];
        acc[task.playbookId].push(task);
        return acc;
      }, {});

      const grouped = playbooks.reduce<Record<string, Array<Record<string, unknown>>>>((acc, playbook) => {
        const entry = { ...playbook, tasks: tasksByPlaybook[playbook.id] ?? [] };
        if (!acc[playbook.type]) acc[playbook.type] = [];
        acc[playbook.type].push(entry);
        return acc;
      }, {});

      return NextResponse.json({ ok: true, data: grouped, devMode: true });
    }
    throw error;
  }
}
