---
Group A – Smoke Test Runbook v1

Purpose
This document defines the minimal manual smoke test procedure for Group A executors in CreAleph.
It verifies execution, gating, lineage, and ledger writes without automation or side effects.

This document is documentation-only.
No code, contracts, or execution behavior are modified.

Scope (Group A)
- Robots Run Executor
- Market Twin Executor
- Builder Planning Executor
- Execution Visibility (read-only)

Preconditions
- A robot exists.
- API is running.
- Authentication is valid.
- No prior execution errors are blocking the robot.

Step 1 — Robots Run (Signals)
Endpoint:
POST /api/robots/run

Expected HTTP Responses:
- 200 OK on success
- 403 if blocked by policy
- 409 if deferred by policy
- 404 only if robot does not exist

Expected Ledger Entries:
- module: robots
- type: signal
- state: succeeded
- lineage includes robotId

If blocked or deferred:
- type: robots_run_gate
- state: failed or cancelled

Step 2 — Market Twin Run (Benchmark)
Endpoint:
POST /api/robots/{robotId}/market-twin/run

Expected HTTP Responses:
- 200 OK on success
- 400 if no signals available
- 403 if blocked by policy
- 409 if deferred by policy

Expected Ledger Entries:
- module: market_twin
- type: benchmark
- state: approved
- lineage includes:
  - robotId
  - dependsOnLedgerIds with the latest signal entry id

If blocked or deferred:
- type: market_twin_gate
- state: failed or cancelled

Step 3 — Builder Planning Run (Draft)
Endpoint:
POST /api/builder/run

Expected HTTP Responses:
- 200 OK on success
- 400 on validation error
- 403 if blocked by coherence or policy
- 409 if deferred

Expected Ledger Entries:
- module: builder
- state: draft
- draft artifacts only:
  - site_plan
  - seo_cluster
  - idea
  - copy
  - task

Execution tracking:
- module: agent-builder
- type: execution_event
- lineage includes signal and benchmark dependencies

Step 4 — Execution Visibility Verification
Endpoint:
GET /api/robots/{robotId}/visibility

Expected Output:
- gates include:
  - robots_run_gate
  - market_twin_gate
- lastExecutionByModule reflects:
  - robots
  - market_twin
  - builder
- nextActions populated when applicable
- no execution triggered

Pass Criteria
- All endpoints respond correctly
- Ledger entries are written with correct module, type, state, and lineage
- No executor reads from robotRun state
- Execution Visibility is read-only and accurate

Status
Group A is considered production-valid when all steps pass.
---
