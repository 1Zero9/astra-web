export type InsightType = "Clarity" | "Empathy" | "Governance" | "Creativity" | "Structure";

export type LayerId =
  | "spark"
  | "frame"
  | "roleplay"
  | "simulation"
  | "reflection"
  | "synthesis";

export interface ReflectionCard {
  cardId: string;
  moduleId: string;
  moduleTitle: string;
  layerId: LayerId;
  layerLabel: string;
  insightType: InsightType;
  metricDelta?: number;
  summary: string;
  narrative: string;
  draftLength: number;
  createdAt: string;
}

const insightRotation: InsightType[] = [
  "Clarity",
  "Structure",
  "Empathy",
  "Governance",
  "Creativity",
];

const layerToInsightFallback: Record<LayerId, InsightType> = {
  spark: "Creativity",
  frame: "Structure",
  roleplay: "Empathy",
  simulation: "Clarity",
  reflection: "Clarity",
  synthesis: "Governance",
};

function pickInsightType(layer: LayerId, existing: InsightType[]): InsightType {
  const nextInsight =
    insightRotation.find((candidate) => !existing.includes(candidate)) ??
    layerToInsightFallback[layer] ??
    "Clarity";

  return nextInsight;
}

function formatMetricDelta(delta: number | undefined): number | undefined {
  if (typeof delta !== "number" || Number.isNaN(delta)) {
    return undefined;
  }

  if (delta > 60) return 60;
  if (delta < -60) return -60;

  return Math.round(delta);
}

function createNarrative(layerId: LayerId, insight: InsightType, textLength: number): string {
  const lengthTone =
    textLength > 280
      ? "You invested depth and detail."
      : textLength > 120
        ? "You kept the pace tight without sacrificing clarity."
        : "You captured the essence with economy.";

  switch (insight) {
    case "Clarity":
      return `${lengthTone} The signal is sharper and better aligned to the learning objective.`;
    case "Empathy":
      return `${lengthTone} The audience will feel seen — empathy anchors this layer.`;
    case "Governance":
      return `${lengthTone} Compliance guardrails are now embedded, keeping risk in check.`;
    case "Creativity":
      return `${lengthTone} Creative energy flows through this layer, inviting curiosity.`;
    case "Structure":
      return `${lengthTone} Structure locked in: your scaffolding supports the rest of the build.`;
    default:
      return `${lengthTone} Progress logged.`;
  }
}

function summariseLayer(layerId: LayerId, insight: InsightType, metricDelta?: number): string {
  const metricText =
    typeof metricDelta === "number"
      ? `${metricDelta >= 0 ? "+" : ""}${metricDelta}%`
      : "Aligned";

  switch (layerId) {
    case "spark":
      return `Spark ignition ${metricText}`;
    case "frame":
      return `Frame tightened ${metricText}`;
    case "roleplay":
      return `Role defined ${metricText}`;
    case "simulation":
      return `Simulation staged ${metricText}`;
    case "reflection":
      return `Reflection distilled ${metricText}`;
    case "synthesis":
      return `Synthesis assembled ${metricText}`;
    default:
      return `${insight} insight ${metricText}`;
  }
}

export interface ReflectionGenerationPayload {
  moduleId: string;
  moduleTitle: string;
  layerId: LayerId;
  layerLabel: string;
  currentDraft: string;
  previousDraft?: string;
  existingInsightTypes?: InsightType[];
}

export function generateReflectionCard({
  moduleId,
  moduleTitle,
  layerId,
  layerLabel,
  currentDraft,
  previousDraft,
  existingInsightTypes = [],
}: ReflectionGenerationPayload): ReflectionCard {
  const trimmed = currentDraft.trim();
  const currentLength = trimmed.length;
  const previousLength = previousDraft?.trim().length ?? 0;

  let delta = currentLength - previousLength;
  if (previousLength === 0) {
    delta = currentLength > 0 ? Math.min(currentLength / 3, 42) : 0;
  }

  const insight = pickInsightType(layerId, existingInsightTypes);
  const metricDelta = formatMetricDelta(delta / 4);

  const cardId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `card-${Math.random().toString(36).slice(2, 11)}`;

  return {
    cardId,
    moduleId,
    moduleTitle,
    layerId,
    layerLabel,
    insightType: insight,
    metricDelta,
    summary: summariseLayer(layerId, insight, metricDelta),
    narrative: createNarrative(layerId, insight, currentLength),
    draftLength: currentLength,
    createdAt: new Date().toISOString(),
  };
}

export interface ProgressSnapshot {
  totalLayersCompleted: number;
  cardsCollected: number;
  skillTotals: Record<InsightType, number>;
  lastUpdated: string | null;
}

export function buildProgressSnapshot(cards: ReflectionCard[]): ProgressSnapshot {
  const skillTotals: Record<InsightType, number> = {
    Clarity: 0,
    Empathy: 0,
    Governance: 0,
    Creativity: 0,
    Structure: 0,
  };

  cards.forEach((card) => {
    skillTotals[card.insightType] += 1;
  });

  const lastUpdated = cards.at(0)?.createdAt ?? null;

  return {
    totalLayersCompleted: cards.length,
    cardsCollected: cards.length,
    skillTotals,
    lastUpdated,
  };
}
