export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export type ArtifactType =
  | "idea"
  | "copy"
  | "playbook"
  | "task"
  | "site_plan"
  | "seo_cluster"
  | "paid_plan";

export type ArtifactPayload = JsonObject;

export type ArtifactLineage = {
  dependsOnLedgerIds: string[];
};

export interface BuilderArtifact extends ArtifactLineage {
  type: ArtifactType;
  payload: ArtifactPayload;
}
