export type CrealephEventType =
  | "aqua.message.created"
  | "aqua.message.applied"
  | "scout.alert.created"
  | "pricing.region.updated"
  | "markettwin.region.updated"
  | "insight.created"
  | "insight.promoted"
  | "bridge.integration.event"
  | "pipeline.lead.created"
  | "pipeline.stage.changed"
  | "report.generated"
  | "report.scheduled"
  | "settings.security.updated"
  | "settings.roles.updated"
  | "developers.key.rotated"
  | "developers.webhook.tested"
  | "parasite.bot.created"
  | "parasite.signal.detected"
  | "parasite.scan.triggered"
  | "parasite.experiment.suggested"
  | "builder.page.published"
  | "builder.template.used"
  | "builder.draft.published"
  | "custom";

export type CrealephEvent = {
  type: CrealephEventType;
  source?: string;
  payload?: any;
  timestamp: number;
};

type HandlerEntry = {
  type: CrealephEventType;
  handler: (event: CrealephEvent) => void;
};

class EventBus {
  private history: CrealephEvent[] = [];
  private handlers: HandlerEntry[] = [];
  private maxHistory = 500;

  emit(type: CrealephEventType, payload?: any) {
    const event: CrealephEvent = {
      type,
      payload,
      source: payload?.source,
      timestamp: Date.now(),
    };

    this.history.push(event);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    for (const entry of this.handlers) {
      if (entry.type === type || entry.type === "custom") {
        try {
          entry.handler(event);
        } catch {
          // ignore handler errors
        }
      }
    }
  }

  on(type: CrealephEventType, handler: (event: CrealephEvent) => void): () => void {
    const entry: HandlerEntry = { type, handler };
    this.handlers.push(entry);
    return () => {
      const idx = this.handlers.indexOf(entry);
      if (idx >= 0) {
        this.handlers.splice(idx, 1);
      }
    };
  }

  getHistory(limit?: number): CrealephEvent[] {
    if (!limit || limit <= 0 || limit >= this.history.length) {
      return [...this.history];
    }
    return this.history.slice(-limit);
  }
}

export const eventBus = new EventBus();

// Helper kept for backward compatibility across modules
export function publishEvent(type: CrealephEventType, payload?: any) {
  eventBus.emit(type, payload);
}
