import { eventBus, type CrealephEvent } from "./event-bus";

export function bootstrapListeners() {
  eventBus.on("bridge.integration.event", (event: CrealephEvent) => {
    const payload: Record<string, unknown> = event.payload ?? {};
    console.log("[BRIDGE] integration event", {
      provider: payload.provider,
      status: payload.status,
      env: payload.env,
      action: payload.action,
      event,
    });
  });

  eventBus.on("pipeline.lead.created", (event: CrealephEvent) => {
    const payload: Record<string, unknown> = event.payload ?? {};
    console.log("[PIPELINE] lead created", {
      source: payload.source,
      region: payload.region,
      value: payload.value,
      event,
    });
  });

  eventBus.on("pipeline.stage.changed", (event: CrealephEvent) => {
    const payload: Record<string, unknown> = event.payload ?? {};
    console.log("[PIPELINE] stage changed", {
      from: payload.from,
      to: payload.to,
      lead: payload.lead,
      event,
    });
  });

  eventBus.on("report.generated", (event: CrealephEvent) => {
    const payload: Record<string, unknown> = event.payload ?? {};
    console.log("[REPORT] generated", {
      module: payload.module,
      title: payload.title,
      event,
    });
  });

  eventBus.on("report.scheduled", (event: CrealephEvent) => {
    const payload: Record<string, unknown> = event.payload ?? {};
    console.log("[REPORT] scheduled", {
      module: payload.module,
      title: payload.title,
      event,
    });
  });

  eventBus.on("builder.page.published", (event: CrealephEvent) => {
    const payload: Record<string, unknown> = event.payload ?? {};
    console.log("[BUILDER] page published", {
      page: payload.page,
      template: payload.template,
      event,
    });
  });

  eventBus.on("builder.template.used", (event: CrealephEvent) => {
    const payload: Record<string, unknown> = event.payload ?? {};
    console.log("[BUILDER] template used", {
      template: payload.template,
      action: payload.action,
      event,
    });
  });

  eventBus.on("builder.draft.published", (event: CrealephEvent) => {
    const payload: Record<string, unknown> = event.payload ?? {};
    console.log("[BUILDER] draft published", {
      draft: payload.draft,
      event,
    });
  });

  eventBus.on("parasite.bot.created", (event: CrealephEvent) => {
    console.log("[PARASITE] bot created", event.payload);
  });

  eventBus.on("parasite.scan.triggered", (event: CrealephEvent) => {
    console.log("[PARASITE] scan triggered", event.payload);
  });

  eventBus.on("parasite.signal.detected", (event: CrealephEvent) => {
    console.log("[PARASITE] signal detected", event.payload);
  });

  eventBus.on("parasite.experiment.suggested", (event: CrealephEvent) => {
    console.log("[PARASITE] experiment suggested", event.payload);
  });

  eventBus.on("custom", (event: CrealephEvent) => {
    console.log("[CUSTOM] event", event);
  });
}
