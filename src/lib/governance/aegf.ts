export type RiskCategory = "Safe" | "Moderate" | "High" | "Critical";

export interface GovernanceFlag {
  type: "PII" | "Bias" | "Compliance" | "Attribution" | "Sensitive";
  message: string;
}

export interface GovernanceSuggestion {
  label: string;
  action: string;
}

export interface GovernanceScanPayload {
  moduleId: string;
  layerId: string;
  content: string;
}

export interface GovernanceScanResult {
  score: number;
  category: RiskCategory;
  flags: GovernanceFlag[];
  suggestions: GovernanceSuggestion[];
}

const PII_KEYWORDS = ["password", "credential", "ssn", "social security", "dob", "phone", "email"];
const SENSITIVE_KEYWORDS = ["confidential", "secret", "classified", "sensitive"];
const ATTRIBUTION_CUES = ["framework", "credit", "source", "citation"];
const BIAS_PATTERNS = ["he or she", "chairman", "whitelist", "blacklist"];

function clampScore(score: number): number {
  if (score < 0) return 0;
  if (score > 100) return 100;
  return Math.round(score);
}

function scoreToCategory(score: number): RiskCategory {
  if (score <= 20) return "Safe";
  if (score <= 50) return "Moderate";
  if (score <= 80) return "High";
  return "Critical";
}

export function runGovernanceScan({
  moduleId,
  layerId,
  content,
}: GovernanceScanPayload): GovernanceScanResult {
  const text = content.toLowerCase();
  const flags: GovernanceFlag[] = [];
  const suggestions: GovernanceSuggestion[] = [];

  let score = 0;

  if (PII_KEYWORDS.some((keyword) => text.includes(keyword))) {
    score += 60;
    flags.push({
      type: "PII",
      message: "Potentially sensitive personal data detected. Mask or remove before exporting.",
    });
    suggestions.push({
      label: "Remove PII",
      action: "Replace or anonymise personal identifiers before sharing.",
    });
  }

  if (SENSITIVE_KEYWORDS.some((keyword) => text.includes(keyword))) {
    score += 20;
    flags.push({
      type: "Sensitive",
      message: "Sensitive classification language found. Verify necessity and approvals.",
    });
    suggestions.push({
      label: "Check approvals",
      action: "Confirm this information can be used in awareness content.",
    });
  }

  if (BIAS_PATTERNS.some((pattern) => text.includes(pattern))) {
    score += 15;
    flags.push({
      type: "Bias",
      message: "Inclusive language alert. Review for gendered or exclusionary phrasing.",
    });
    suggestions.push({
      label: "Use neutral language",
      action: "Swap for inclusive alternatives (e.g., 'chairperson', 'allow list').",
    });
  }

  if (!ATTRIBUTION_CUES.some((cue) => text.includes(cue)) && layerId === "synthesis") {
    score += 15;
    flags.push({
      type: "Attribution",
      message: "Attribution cue missing. Add framework or credit per ASTRA guidelines.",
    });
    suggestions.push({
      label: "Add credit line",
      action: "Include “Generated with ASTRA using [Framework].” before export.",
    });
  }

  if (moduleId === "module-4" && score < 30) {
    suggestions.push({
      label: "Double-check governance",
      action: "Module 4 focuses on governance. Consider adding explicit guardrails.",
    });
  }

  const finalScore = clampScore(score);
  const category = scoreToCategory(finalScore);

  return {
    score: finalScore,
    category,
    flags,
    suggestions,
  };
}
