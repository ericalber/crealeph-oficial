export type CrealephEventInput = {
  type: string;
  source: string;
  payload?: Record<string, unknown>;
};

export type CrealephEvent = CrealephEventInput & {
  timestamp: number;
};

type HandlerEntry = {
  type: string;
  handler: (event: CrealephEvent) => void;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

class EventBus {
  private history: CrealephEvent[] = [];
  private handlers: HandlerEntry[] = [];
  private maxHistory = 500;

  emit(event: CrealephEventInput): void;
  emit(type: string, payload?: Record<string, unknown>): void;
  emit(arg1: string | CrealephEventInput, payload?: Record<string, unknown>) {
    const event: CrealephEvent =
      typeof arg1 === "string"
        ? {
            type: arg1,
            source:
              isRecord(payload) && typeof payload.source === "string" ? payload.source : "unknown",
            payload,
            timestamp: Date.now(),
          }
        : {
            type: arg1.type,
            source: arg1.source,
            payload: arg1.payload,
            timestamp: Date.now(),
          };

    this.history.push(event);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    for (const entry of this.handlers) {
      if (entry.type === event.type || entry.type === "custom") {
        try {
          entry.handler(event);
        } catch {
          // ignore handler errors
        }
      }
    }
  }

  on(type: string, handler: (event: CrealephEvent) => void): () => void {
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
export function publishEvent(event: CrealephEventInput) {
  eventBus.emit(event);
}
