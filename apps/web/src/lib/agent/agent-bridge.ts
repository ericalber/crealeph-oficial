import OpenAI from "openai";
import type { AgentInput, AgentOutput } from "src/lib/contracts/agent-boundary";
import {
  validateAgentInput,
  validateAgentOutput,
} from "src/lib/contracts/agent-boundary-validate";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function assertValidAgentInput(input: AgentInput): void {
  const validation = validateAgentInput(input);
  if (validation.ok === false) {
    throw new Error(validation.error.message);
  }
}

function assertValidAgentOutput(output: unknown, input: AgentInput): asserts output is AgentOutput {
  const validation = validateAgentOutput(output, input);
  if (validation.ok === false) {
    throw new Error(validation.error.message);
  }
}

export async function runAgentWithBoundary(input: AgentInput): Promise<AgentOutput> {
  assertValidAgentInput(input);

  const response = await openai.responses.create({
    model: input.agentVersion,
    input: JSON.stringify(input),
  });

  const outputText = response.output_text;
  if (typeof outputText !== "string" || outputText.trim().length === 0) {
    throw new Error("MODEL_OUTPUT_INVALID");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(outputText);
  } catch {
    throw new Error("MODEL_OUTPUT_INVALID");
  }

  assertValidAgentOutput(parsed, input);
  return parsed;
}
