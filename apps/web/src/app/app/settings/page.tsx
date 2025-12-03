"use client";
import { ButtonHTMLAttributes, useMemo, useState } from "react";
import { PageHeader } from "@/components/dashboard/layout/PageHeader";
import { SectionHeader } from "@/components/dashboard/layout/SectionHeader";
import { KPICard } from "@/components/dashboard/cards/KPICard";
import { ChartCard } from "@/components/dashboard/cards/ChartCard";
import { FilterBar, type FilterChip } from "@/components/dashboard/data/FilterBar";
import { DataTable } from "@/components/dashboard/data/DataTable";
import { Divider } from "@/components/dashboard/sections/Divider";
import { DashboardCard } from "@/components/dashboard/cards/DashboardCard";
import { EmptyState } from "@/components/dashboard/feedback/EmptyState";
import { Skeleton } from "@/components/dashboard/feedback/Skeleton";
import { eventBus } from "@/lib/crealeph/event-bus";

function GhostButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="inline-flex h-9 items-center justify-center rounded-[var(--radius-sm)] border px-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
      style={{ borderColor: "var(--line)" }}
    />
  );
}

type TeamRow = {
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Analyst" | "Viewer";
  status: "Active" | "Pending" | "Disabled";
  joined: string;
  joinedDate: Date;
};

type AuditRow = {
  event: string;
  actor: string;
  target: string;
  type: "Login Failed" | "Role Changed" | "User Invited" | "Billing Updated";
  timestamp: string;
  timestampDate: Date;
};

const teamRows: TeamRow[] = [
  { name: "Alice Johnson", email: "alice@crealeph.com", role: "Admin", status: "Active", joined: "Jan 4, 2025", joinedDate: new Date("2025-01-04") },
  { name: "Bruno Silva", email: "bruno@crealeph.com", role: "Manager", status: "Pending", joined: "Jan 11, 2025", joinedDate: new Date("2025-01-11") },
  { name: "Carla Mendes", email: "carla@crealeph.com", role: "Analyst", status: "Active", joined: "Dec 15, 2024", joinedDate: new Date("2024-12-15") },
  { name: "David Lee", email: "david@crealeph.com", role: "Viewer", status: "Disabled", joined: "Nov 22, 2024", joinedDate: new Date("2024-11-22") },
  { name: "Elena Costa", email: "elena@crealeph.com", role: "Manager", status: "Active", joined: "Jan 2, 2025", joinedDate: new Date("2025-01-02") },
  { name: "Fernando Dias", email: "fernando@crealeph.com", role: "Analyst", status: "Pending", joined: "Jan 9, 2025", joinedDate: new Date("2025-01-09") },
];

const auditRows: AuditRow[] = [
  { event: "Failed login", actor: "alice@crealeph.com", target: "workspace", type: "Login Failed", timestamp: "10m ago", timestampDate: new Date("2025-01-13T09:15:00") },
  { event: "Role changed to Manager", actor: "alice@crealeph.com", target: "bruno@crealeph.com", type: "Role Changed", timestamp: "1h ago", timestampDate: new Date("2025-01-13T08:30:00") },
  { event: "User invited", actor: "carla@crealeph.com", target: "fernando@crealeph.com", type: "User Invited", timestamp: "3h ago", timestampDate: new Date("2025-01-13T06:45:00") },
  { event: "Billing updated", actor: "alice@crealeph.com", target: "workspace billing", type: "Billing Updated", timestamp: "6h ago", timestampDate: new Date("2025-01-13T04:00:00") },
];

function statusBadgeColor(status: TeamRow["status"]) {
  if (status === "Active") return "var(--success)";
  if (status === "Pending") return "var(--warning)";
  return "var(--danger)";
}

function auditTypeColor(type: AuditRow["type"]) {
  if (type === "Login Failed") return "var(--danger)";
  if (type === "Role Changed") return "var(--warning)";
  if (type === "User Invited") return "var(--brand)";
  return "var(--info)";
}

export default function SettingsPage() {
  const [chips, setChips] = useState<FilterChip[]>([
    { id: "active", label: "Active", active: false },
    { id: "pending", label: "Pending", active: false },
    { id: "disabled", label: "Disabled", active: false },
  ]);
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  const [auditChips, setAuditChips] = useState<FilterChip[]>([
    { id: "login_failed", label: "Login Failed", active: false },
    { id: "role_changed", label: "Role Changed", active: false },
    { id: "user_invited", label: "User Invited", active: false },
    { id: "billing_updated", label: "Billing Updated", active: false },
  ]);
  const [auditType, setAuditType] = useState("All");
  const [auditSearch, setAuditSearch] = useState("");
  const [auditDate, setAuditDate] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  const kpis = [
    { label: "Total Users", value: "14", delta: "+3", tone: "positive" as const },
    { label: "Pending Invites", value: "2", delta: "+1", tone: "neutral" as const },
    { label: "Roles Active", value: "5", delta: "=", tone: "neutral" as const },
    { label: "Billing Status", value: "Active", delta: "on time", tone: "positive" as const },
    { label: "Audit Events (24h)", value: "61", delta: "+8", tone: "negative" as const },
  ];

  const teamColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
    { key: "joined", label: "Joined" },
    { key: "actions", label: "Actions", align: "right" as const },
  ];

  const auditColumns = [
    { key: "event", label: "Event" },
    { key: "actor", label: "Actor" },
    { key: "target", label: "Target" },
    { key: "type", label: "Type" },
    { key: "timestamp", label: "Timestamp" },
  ];

  const filteredTeamRows = useMemo(() => {
    const active = chips.filter((c) => c.active).map((c) => c.id);
    const q = search.trim().toLowerCase();

    return teamRows.filter((row) => {
      const matchChip =
        active.length === 0 ||
        active.some((chip) => {
          if (chip === "active") return row.status === "Active";
          if (chip === "pending") return row.status === "Pending";
          if (chip === "disabled") return row.status === "Disabled";
          return true;
        });

      const matchRole = role === "All" || row.role === role;
      const matchStatus = status === "All" || row.status === status;

      const matchSearch =
        q.length === 0 ||
        row.name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.role.toLowerCase().includes(q);

      const matchDate =
        !dateRange.from ||
        !dateRange.to ||
        (row.joinedDate.getTime() >= dateRange.from.getTime() &&
          row.joinedDate.getTime() <= dateRange.to.getTime());

      return matchChip && matchRole && matchStatus && matchSearch && matchDate;
    });
  }, [chips, role, status, search, dateRange]);

  const filteredAuditRows = useMemo(() => {
    const active = auditChips.filter((c) => c.active).map((c) => c.id);
    const q = auditSearch.trim().toLowerCase();

    return auditRows.filter((row) => {
      const matchChip =
        active.length === 0 ||
        active.some((chip) => {
          if (chip === "login_failed") return row.type === "Login Failed";
          if (chip === "role_changed") return row.type === "Role Changed";
          if (chip === "user_invited") return row.type === "User Invited";
          if (chip === "billing_updated") return row.type === "Billing Updated";
          return true;
        });

      const matchType = auditType === "All" || row.type === auditType;

      const matchSearch =
        q.length === 0 ||
        row.event.toLowerCase().includes(q) ||
        row.actor.toLowerCase().includes(q) ||
        row.target.toLowerCase().includes(q) ||
        row.type.toLowerCase().includes(q);

      const matchDate =
        !auditDate.from ||
        !auditDate.to ||
        (row.timestampDate.getTime() >= auditDate.from.getTime() &&
          row.timestampDate.getTime() <= auditDate.to.getTime());

      return matchChip && matchType && matchSearch && matchDate;
    });
  }, [auditChips, auditType, auditSearch, auditDate]);

  const isLoading = false;
  const isEmptyTeam = filteredTeamRows.length === 0;
  const isEmptyAudit = filteredAuditRows.length === 0;

  const handleTeamClear = () => {
    setChips((prev) => prev.map((c) => ({ ...c, active: false })));
    setRole("All");
    setStatus("All");
    setSearch("");
    setDateRange({ from: null, to: null });
  };

  const handleAuditClear = () => {
    setAuditChips((prev) => prev.map((c) => ({ ...c, active: false })));
    setAuditType("All");
    setAuditSearch("");
    setAuditDate({ from: null, to: null });
  };

  return (
    <div className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Dashboard / Admin / Settings</p>

      <PageHeader
        title="Settings"
        subtitle="Workspace roles, billing, audit logs and system preferences."
        actions={
          <>
            <GhostButton
              onClick={() => {
                eventBus.emit("custom", { source: "settings", action: "invite_user_top" });
              }}
            >
              Invite User
            </GhostButton>
            <GhostButton
              onClick={() => {
                eventBus.emit("custom", { source: "settings", action: "update_billing_top" });
              }}
            >
              Update Billing
            </GhostButton>
            <GhostButton
              onClick={() => {
                eventBus.emit("custom", { source: "settings", action: "manage_roles_top" });
              }}
            >
              Manage Roles
            </GhostButton>
          </>
        }
      />

      <DashboardCard>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--ink)]">AI Signal</p>
            <p className="text-sm text-[var(--muted)]">
              AI detected increased security-related events and failed logins. Review access levels, role assignments and audit logs to ensure workspace integrity.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <GhostButton
              onClick={() => {
                eventBus.emit("custom", { source: "settings", action: "review_logs_ai_signal" });
              }}
            >
              Review Logs
            </GhostButton>
            <GhostButton
              onClick={() => {
                eventBus.emit("custom", { source: "settings", action: "manage_roles_ai_signal" });
              }}
            >
              Manage Roles
            </GhostButton>
            <GhostButton
              onClick={() => {
                eventBus.emit("custom", { source: "settings", action: "apply_security_policy" });
              }}
            >
              Apply Security Policy
            </GhostButton>
          </div>
        </div>
      </DashboardCard>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[96px]" />)
          : kpis.map((kpi) => <KPICard key={kpi.label} label={kpi.label} value={kpi.value} delta={kpi.delta} tone={kpi.tone} />)}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="User Growth (30 days)">
          {isLoading ? <Skeleton className="h-[160px] w-full" /> : <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />}
        </ChartCard>
        <ChartCard title="Audit Events by Type">
          {isLoading ? <Skeleton className="h-[160px] w-full" /> : <Skeleton className="h-[160px] w-full rounded-[var(--radius-sm)]" />}
        </ChartCard>
      </div>

      <SectionHeader title="Team & Roles" description="Manage access, permissions and invitations." />

      <FilterBar
        chips={chips}
        onChipToggle={(id) => setChips((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))}
        showSearch
        searchPlaceholder="Search by name, email or role"
        showDateRange
        onDateChange={setDateRange}
        selects={[
          { id: "role", label: "Role", value: role, options: ["All", "Admin", "Manager", "Analyst", "Viewer"], onChange: setRole },
          { id: "status", label: "Status", value: status, options: ["All", "Active", "Pending", "Disabled"], onChange: setStatus },
        ]}
        extra={
          <GhostButton
            onClick={() => {
              eventBus.emit("custom", { source: "settings", action: "invite_user_team_filter" });
            }}
          >
            Invite User
          </GhostButton>
        }
        onClear={handleTeamClear}
      />

      {isLoading ? (
        <Skeleton className="h-[260px] w-full rounded-[var(--radius-md)]" />
      ) : isEmptyTeam ? (
        <EmptyState
          title="No users found"
          description="Try adjusting the filters or invite a new user."
          action={
            <GhostButton
              onClick={() => {
                eventBus.emit("custom", { source: "settings", action: "invite_user_empty" });
              }}
            >
              Invite User
            </GhostButton>
          }
        />
      ) : (
        <DataTable
          columns={teamColumns}
          rows={filteredTeamRows.map((row, index) => ({
            ...row,
            status: (
              <span
                className="rounded-full px-2 py-1 text-xs font-semibold"
                style={{ backgroundColor: "var(--surface-muted)", color: statusBadgeColor(row.status) }}
              >
                {row.status}
              </span>
            ),
            actions: (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <GhostButton
                  aria-label="View Profile"
                  onClick={() => {
                    eventBus.emit("custom", { source: "settings", action: "view_profile", row });
                  }}
                >
                  View Profile
                </GhostButton>
                <GhostButton
                  aria-label="Change Role"
                  onClick={() => {
                    eventBus.emit("custom", { source: "settings", action: "change_role", row });
                  }}
                >
                  Change Role
                </GhostButton>
                <GhostButton
                  aria-label="Disable User"
                  onClick={() => {
                    eventBus.emit("custom", { source: "settings", action: "disable_user", row });
                  }}
                >
                  Disable User
                </GhostButton>
                {row.status === "Pending" ? (
                  <GhostButton
                    aria-label="Resend Invite"
                    onClick={() => {
                      eventBus.emit("custom", { source: "settings", action: "resend_invite", row });
                    }}
                  >
                    Resend Invite
                  </GhostButton>
                ) : null}
              </div>
            ),
            key: `${row.email}-${index}`,
          }))}
        />
      )}

      <Divider />

      <SectionHeader title="Billing" description="Subscription, invoices, payment methods and renewal." />

      <DashboardCard>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Current Plan</p>
            <p className="text-sm font-semibold text-[var(--ink)]">PRO</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Renewal</p>
            <p className="text-sm font-semibold text-[var(--ink)]">Jan 21, 2025</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Payment Method</p>
            <p className="text-sm font-semibold text-[var(--ink)]">**** 4242</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Status</p>
            <p className="text-sm font-semibold text-[var(--ink)] text-[var(--success)]">Active</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <GhostButton
            onClick={() => {
              eventBus.emit("custom", { source: "settings", action: "update_plan" });
            }}
          >
            Update Plan
          </GhostButton>
          <GhostButton
            onClick={() => {
              eventBus.emit("custom", { source: "settings", action: "change_payment" });
            }}
          >
            Change Payment Method
          </GhostButton>
          <GhostButton
            onClick={() => {
              eventBus.emit("custom", { source: "settings", action: "download_invoice" });
            }}
          >
            Download Invoice
          </GhostButton>
        </div>
      </DashboardCard>

      <Divider />

      <SectionHeader title="Notifications" description="Security alerts, billing, workspace messages and updates." />

      <DashboardCard>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--ink)]">Security Alerts</span>
            <GhostButton
              onClick={() => {
                eventBus.emit("custom", { source: "settings", action: "toggle_security_alerts" });
              }}
            >
              Toggle
            </GhostButton>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--ink)]">Billing Alerts</span>
            <GhostButton
              onClick={() => {
                eventBus.emit("custom", { source: "settings", action: "toggle_billing_alerts" });
              }}
            >
              Toggle
            </GhostButton>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--ink)]">Workspace Messages</span>
            <GhostButton
              onClick={() => {
                eventBus.emit("custom", { source: "settings", action: "toggle_workspace_messages" });
              }}
            >
              Toggle
            </GhostButton>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--ink)]">System Updates</span>
            <GhostButton
              onClick={() => {
                eventBus.emit("custom", { source: "settings", action: "toggle_system_updates" });
              }}
            >
              Toggle
            </GhostButton>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <GhostButton
            onClick={() => {
              eventBus.emit("custom", { source: "settings", action: "apply_notification_changes" });
            }}
          >
            Apply Changes
          </GhostButton>
          <GhostButton
            onClick={() => {
              eventBus.emit("custom", { source: "settings", action: "restore_notification_defaults" });
            }}
          >
            Restore Defaults
          </GhostButton>
        </div>
      </DashboardCard>

      <Divider />

      <SectionHeader title="Audit Logs" description="Security events, role changes, invitations and billing updates." />

      <FilterBar
        chips={auditChips}
        onChipToggle={(id) => setAuditChips((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))}
        showSearch
        searchPlaceholder="Search event, actor or target"
        showDateRange
        onDateChange={setAuditDate}
        selects={[
          {
            id: "auditType",
            label: "Type",
            value: auditType,
            options: ["All", "Login Failed", "Role Changed", "User Invited", "Billing Updated"],
            onChange: setAuditType,
          },
        ]}
        extra={
          <GhostButton
            onClick={() => {
              eventBus.emit("custom", { source: "settings", action: "open_audit_export" });
            }}
          >
            Export Logs
          </GhostButton>
        }
        onClear={handleAuditClear}
      />

      {isLoading ? (
        <Skeleton className="h-[240px] w-full rounded-[var(--radius-md)]" />
      ) : isEmptyAudit ? (
        <EmptyState
          title="No audit events found"
          description="Adjust filters to view audit history."
          action={
            <GhostButton
              onClick={() => {
                eventBus.emit("custom", { source: "settings", action: "refresh_audit" });
              }}
            >
              Refresh
            </GhostButton>
          }
        />
      ) : (
        <DataTable
          columns={auditColumns}
          rows={filteredAuditRows.map((row, index) => ({
            ...row,
            type: (
              <span
                className="rounded-full px-2 py-1 text-xs font-semibold"
                style={{ backgroundColor: "var(--surface-muted)", color: auditTypeColor(row.type) }}
              >
                {row.type}
              </span>
            ),
            actions: undefined,
            key: `${row.event}-${index}`,
          }))}
        />
      )}

      <Divider />

      <DashboardCard>
        <p className="text-sm font-semibold text-[var(--ink)]">Cross-links CREALEPH</p>
        <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
          <li>Developers → manage API keys and webhooks for secure access.</li>
          <li>Bridge → validate integration health impacting user actions.</li>
          <li>InsightScore → generate hypotheses from security or role changes.</li>
          <li>Reports → audit trail exports and compliance evidence.</li>
          <li>Builder → enforce publish permissions and audit changes.</li>
        </ul>
      </DashboardCard>
    </div>
  );
}
