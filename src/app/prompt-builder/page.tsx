"use client";

import { useMemo, useState } from "react";
import {
  buildProgressSnapshot,
  generateReflectionCard,
  LayerId,
  ReflectionCard,
} from "@/lib/ilm/reflection";
import { runGovernanceScan } from "@/lib/governance/aegf";

type FrameworkId = "CLEAR" | "RISEN" | "COAST" | "ILM" | "LeadershipTrack";

type LayerMeta = {
  id: LayerId;
  label: string;
  focus: string;
  tone: string;
};

type LayerDefinition = {
  headline: string;
  instructions: string;
  prompt: string;
  placeholder: string;
};

type ModuleDefinition = {
  id: string;
  title: string;
  theme: string;
  objective: string;
  output: string;
  frameworks: FrameworkId[];
  layers: Record<LayerId, LayerDefinition>;
  reflectionPrompts: string[];
};

type FrameworkDefinition = {
  id: FrameworkId;
  name: string;
  summary: string;
  cues: string[];
};

const LAYERS: LayerMeta[] = [
  { id: "spark", label: "L0 · Spark", focus: "Hook & Objective", tone: "Inspire and anchor purpose" },
  { id: "frame", label: "L1 · Frame", focus: "Context & Constraints", tone: "Provide guardrails" },
  { id: "roleplay", label: "L2 · Roleplay", focus: "Perspective & Stakeholders", tone: "Define who is speaking" },
  { id: "simulation", label: "L3 · Simulation", focus: "Actions & Decisions", tone: "Design the practice flow" },
  { id: "reflection", label: "L4 · Reflection", focus: "Debrief & Transfer", tone: "Capture insights" },
  { id: "synthesis", label: "L5 · Synthesis", focus: "Mega Prompt / Artefact", tone: "Assemble the deliverable" },
];

const FRAMEWORKS: Record<FrameworkId, FrameworkDefinition> = {
  CLEAR: {
    id: "CLEAR",
    name: "CLEAR",
    summary: "A comprehensive structure to ensure your prompts include the right detail.",
    cues: ["Context", "Limitations", "Examples", "Audience", "Role"],
  },
  RISEN: {
    id: "RISEN",
    name: "RISEN",
    summary: "Great for multi-step tasks that need crisp direction.",
    cues: ["Role", "Instructions", "Steps", "End goal", "Narrowing"],
  },
  COAST: {
    id: "COAST",
    name: "COAST",
    summary: "Scenario-based planning that keeps objectives and actions aligned.",
    cues: ["Context", "Objective", "Actions", "Scenario", "Task"],
  },
  ILM: {
    id: "ILM",
    name: "Inception Learning Model",
    summary: "Layered learning pattern that moves from spark to synthesis.",
    cues: ["Spark", "Frame", "Roleplay", "Simulation", "Reflection", "Synthesis"],
  },
  LeadershipTrack: {
    id: "LeadershipTrack",
    name: "Leadership Track",
    summary: "Intent → Lens → Mindset → Method → Measure. Pair with ILM for Module 3.",
    cues: ["Intent", "Lens", "Mindset", "Method", "Measure"],
  },
};

const MODULES: ModuleDefinition[] = [
  {
    id: "module-1",
    title: "Module 1 · Prompt Engineering Foundations",
    theme: "Learn to think like an AI collaborator.",
    objective:
      "Build a strong foundation in prompt design by exploring clarity, role, and structure through the CLEAR and RISEN frameworks.",
    output: "A reusable personal prompt template library with annotated examples.",
    frameworks: ["ILM", "CLEAR", "RISEN"],
    layers: {
      spark: {
        headline: "What makes a good prompt?",
        instructions:
          "Contrast weak vs strong prompts to prime the learner. Anchor the module's promise in one or two sentences.",
        prompt: "Describe the before/after moment you want the learner to experience.",
        placeholder:
          "Example: “You’ve seen prompts fall flat before. In this module we’ll sharpen them until they sound like a pro analyst wrote them.”",
      },
      frame: {
        headline: "Set the task and constraints.",
        instructions:
          "Outline the broader AI task (e.g., summarise a report) and specify any limitations using CLEAR (context, audience, role).",
        prompt: "Detail the scenario, audience, and any boundaries to respect.",
        placeholder:
          "Context: Security team needs a quick incident summary.\nAudience: Non-technical execs.\nLimitations: Stay under 250 words, avoid jargon.",
      },
      roleplay: {
        headline: "Assign the AI collaborator.",
        instructions:
          "Define the persona the AI should adopt and the mindset shift the learner should make. Reference RISEN’s Role and Instructions.",
        prompt: "Who is the AI in this exercise and what expertise should shine through?",
        placeholder:
          "Example: “You are ASTRA, a senior prompt engineer coaching a junior analyst. Explain your reasoning as you go.”",
      },
      simulation: {
        headline: "Practice refining prompts.",
        instructions:
          "Design a step-by-step refinement exercise where the learner upgrades a weak prompt into a strong one.",
        prompt: "Lay out the steps or comparisons the learner will execute.",
        placeholder:
          "Step 1: Analyse the weak prompt.\nStep 2: Apply CLEAR to rewrite.\nStep 3: Compare outputs and score precision gains.",
      },
      reflection: {
        headline: "Capture improvement.",
        instructions:
          "Help the learner measure what changed. Consider metrics like precision, tone, or stakeholder alignment.",
        prompt: "What reflective questions or metrics should they log?",
        placeholder:
          "Example: “Where did clarity improve the most? Rate the final prompt’s precision from 1-5 and note why.”",
      },
      synthesis: {
        headline: "Build the reusable template.",
        instructions:
          "Combine the previous layers into an export-ready mega prompt or template that others can reuse.",
        prompt: "Draft the final template or playbook. Include placeholders and quick usage notes.",
        placeholder:
          "Template Name: Exec Incident Summary\nRole: ASTRA Senior Analyst\nInstructions: …\nChecklist: …",
      },
    },
    reflectionPrompts: [
      "Which CLEAR element unlocked the biggest change?",
      "Where can this template live for easy reuse?",
      "What metric will you track next time you iterate on this prompt?",
    ],
  },
  {
    id: "module-2",
    title: "Module 2 · AI for Security Awareness",
    theme: "Apply AI prompting to create real-world awareness materials.",
    objective:
      "Guide users to create an end-to-end phishing simulation using ILM layering and the COAST framework.",
    output: "An exportable phishing simulation kit (email + micro-quiz + follow-up reflection).",
    frameworks: ["ILM", "COAST", "CLEAR"],
    layers: {
      spark: {
        headline: "Hook with a believable incident.",
        instructions:
          "Describe a compelling phishing scenario that resonates with your organisation. Mention the learner’s role.",
        prompt: "Write the incident hook and the learning aim in under 80 words.",
        placeholder:
          "Example: “Finance just reported a bogus invoice request. You’ve got one hour to brief staff before payment is made.”",
      },
      frame: {
        headline: "Specify context, difficulty, and constraints.",
        instructions:
          "Use COAST to outline department, risk level, and any compliance or tone requirements. Call out EASY/MED/HARD difficulty.",
        prompt: "Capture the situational inputs the AI must respect.",
        placeholder:
          "Context: Finance, quarterly close.\nObjective: Teach invoice fraud spotting.\nActions: Draft email, micro-quiz, SMS reminder.\nScenario: Medium difficulty per NIST.\nTask: Deliverables ready for LMS upload.",
      },
      roleplay: {
        headline: "Give the AI its coaching persona.",
        instructions:
          "Assign ASTRA the role of Security Awareness Coach and note stakeholders (learners, managers). Mention ethical guardrails.",
        prompt: "Define the voice, empathy level, and non-negotiables.",
        placeholder:
          "Example: “Adopt a supportive coach voice. Avoid shaming. Reinforce that reporting mistakes is encouraged.”",
      },
      simulation: {
        headline: "Design the training artefacts.",
        instructions:
          "Outline the steps to create the phishing email, micro-quiz, and follow-up message. Include at least one feedback checkpoint.",
        prompt: "List the tasks or prompts the learner will run.",
        placeholder:
          "1. Draft phishing email copy.\n2. Generate 3-question quiz with answer key.\n3. Create debrief message + CTA to report.",
      },
      reflection: {
        headline: "Evaluate ethics and effectiveness.",
        instructions:
          "Prompt the learner to assess clarity, fairness, and impact. Encourage them to log lessons for the next campaign.",
        prompt: "Write the debrief questions or metrics.",
        placeholder:
          "Example: “Does the email avoid harmful stereotypes? Rate likelihood of learners reporting future attempts.”",
      },
      synthesis: {
        headline: "Assemble the simulation kit.",
        instructions:
          "Combine outputs into a structured pack ready for export (Markdown or LMS import). Include a usage note and credits.",
        prompt: "Outline the final artefact and any formatting instructions.",
        placeholder:
          "Package structure:\n- Scenario overview\n- Phishing email\n- Quiz\n- Follow-up message\n- Reflection questions\nCredit: Generated with ASTRA Awareness Coach.",
      },
    },
    reflectionPrompts: [
      "How will you brief managers before launching this simulation?",
      "What success metric (e.g., report rate) will you monitor after deployment?",
      "Which COAST element needs more specificity next iteration?",
    ],
  },
  {
    id: "module-3",
    title: "Module 3 · AI for Leadership",
    theme: "Lead with clarity and empathy in an AI-augmented environment.",
    objective:
      "Use the ILM pattern plus the Leadership Track (Intent / Lens / Mindset / Method / Measure) to craft a three-month leadership playbook.",
    output: "A shareable AI leadership strategy prompt with roadmap milestones.",
    frameworks: ["ILM", "LeadershipTrack", "RISEN"],
    layers: {
      spark: {
        headline: "Frame the leadership challenge.",
        instructions:
          "Capture the tension of leading hybrid AI–human teams. Position the module as the solution.",
        prompt: "Write a short narrative hook and desired leadership outcome.",
        placeholder:
          "Example: “Your team is split between human analysts and AI copilots. In 90 days you need everyone aligned on mission and ethics.”",
      },
      frame: {
        headline: "Clarify context and success criteria.",
        instructions:
          "Detail organisation type, cultural dynamics, and strategic goal. Reference the Leadership Track’s Intent and Lens.",
        prompt: "Document the playing field and constraints.",
        placeholder:
          "Intent: Launch secure AI workflows.\nLens: Transparency-first culture.\nConstraints: Highly regulated, global team, limited training budget.",
      },
      roleplay: {
        headline: "Set the advisor bench.",
        instructions:
          "Assign AI as advisor, strategist, or coach. Note stakeholders (exec team, managers, employees) and how empathy shows up.",
        prompt: "Define the advisory roles and communication tone.",
        placeholder:
          "Example: “ASTRA acts as Chief Strategy Coach. Weekly syncs with VP Engineering and CISO. Use inclusive language, credit human wins.”",
      },
      simulation: {
        headline: "Design the 3-month roadmap.",
        instructions:
          "Lay out phases using Mindset → Method → Measure. Include rituals, checkpoints, and comms moments.",
        prompt: "Describe the milestones and deliverables.",
        placeholder:
          "Month 1: Listen + map risks.\nMonth 2: Pilot AI workflows with change stories.\nMonth 3: Formalise governance & share metrics dashboard.",
      },
      reflection: {
        headline: "Assess tone and alignment.",
        instructions:
          "Prompt the leader to test inclusivity, clarity, and measurable impact. Encourage feedback loops.",
        prompt: "List reflection questions or success indicators.",
        placeholder:
          "Example: “Which voices are missing from the plan? How will you know morale is improving? What risks require escalation?”",
      },
      synthesis: {
        headline: "Publish the leadership strategy prompt.",
        instructions:
          "Combine Intent, Lens, Mindset, Method, Measure into a single artefact ready to brief stakeholders or generate comms.",
        prompt: "Write the final playbook including timeline and credit.",
        placeholder:
          "Artefact structure:\n- Intent statement\n- North-star narrative\n- 90-day cadence (Mindset/Method/Measure)\n- Stakeholder comms prompt\nCredit: Strategy co-developed with ASTRA Leadership Coach.",
      },
    },
    reflectionPrompts: [
      "Who will review this plan for blind spots?",
      "What leading indicator will tell you the culture is shifting?",
      "How will you celebrate wins generated by humans and AI together?",
    ],
  },
  {
    id: "module-4",
    title: "Module 4 · Governance & Ethics",
    theme: "Ensure safe, compliant, and ethical AI use.",
    objective:
      "Educate teams to embed governance checks, bias prevention, and attribution within every prompt.",
    output: "An AI governance prompt framework and checklist with auto-inserted credit lines.",
    frameworks: ["ILM", "CLEAR"],
    layers: {
      spark: {
        headline: "Pose the risk question.",
        instructions:
          "Hook the learner with the consequence of unchecked prompts. Clarify the stakes.",
        prompt: "Draft a scenario that makes the risk tangible.",
        placeholder:
          "Example: “What happens if a prompt leaks customer PII? In 10 minutes you’ll build the safeguard that prevents it.”",
      },
      frame: {
        headline: "Define boundaries and sensitivity.",
        instructions:
          "List ethical risks, data classifications, and compliance requirements. Use CLEAR to spell out limitations.",
        prompt: "Capture the governance constraints.",
        placeholder:
          "Context: Handling customer support transcripts.\nLimitations: Strip personal data, cite sources, log decisions.\nAudience: Governance reviewers.",
      },
      roleplay: {
        headline: "Assign the compliance mindset.",
        instructions:
          "Set AI as Compliance Officer or Risk Partner. Note escalation points and accountability.",
        prompt: "Describe oversight roles and attitudes.",
        placeholder:
          "Example: “ASTRA acts as Compliance Officer, challenging assumptions, highlighting bias risk, and logging audits.”",
      },
      simulation: {
        headline: "Build the review workflow.",
        instructions:
          "Create a prompt review checklist and apply it to a test case. Include guardrails for attribution and approvals.",
        prompt: "Outline the steps of the checklist.",
        placeholder:
          "Checklist: Data sanitisation → Bias scan → Attribution check → Approval log.\nTest: Apply to draft sentiment prompt for incident reports.",
      },
      reflection: {
        headline: "Record governance insights.",
        instructions:
          "Help learners note transparency wins, risk trade-offs, and where automation needs human sign-off.",
        prompt: "Write the questions for the debrief.",
        placeholder:
          "Example: “Where could bias still slip through? Who must review this artefact quarterly?”",
      },
      synthesis: {
        headline: "Produce the governance framework.",
        instructions:
          "Assemble checklist, guardrails, and attribution language into an exportable framework.",
        prompt: "Draft the final governance template with credits.",
        placeholder:
          "Framework layout:\n- Usage context\n- Mandatory checks\n- Approval workflow\n- Attribution footer\nCredit: Generated with ASTRA Governance Officer.",
      },
    },
    reflectionPrompts: [
      "Which stakeholder signs off on this workflow?",
      "How often will you revisit the checklist for new risks?",
      "Where will you store artefacts for audit readiness?",
    ],
  },
];

const initialDrafts: Record<string, Record<LayerId, string>> = MODULES.reduce(
  (acc, module) => ({
    ...acc,
    [module.id]: LAYERS.reduce(
      (layerAcc, layer) => ({
        ...layerAcc,
        [layer.id]: "",
      }),
      {} as Record<LayerId, string>,
    ),
  }),
  {} as Record<string, Record<LayerId, string>>,
);

const initialReflections: Record<string, ReflectionCard[]> = MODULES.reduce(
  (acc, module) => ({
    ...acc,
    [module.id]: [],
  }),
  {} as Record<string, ReflectionCard[]>,
);

export default function PromptBuilderPage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(MODULES[0]?.id ?? "");
  const [drafts, setDrafts] = useState<Record<string, Record<LayerId, string>>>(initialDrafts);
  const [reflectionCards, setReflectionCards] =
    useState<Record<string, ReflectionCard[]>>(initialReflections);

  const selectedModule = useMemo(
    () => MODULES.find((module) => module.id === selectedModuleId) ?? MODULES[0],
    [selectedModuleId],
  );

  const moduleReflections = reflectionCards[selectedModule.id] ?? [];

  const handleLayerChange = (layerId: LayerId, value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [selectedModule.id]: {
        ...prev[selectedModule.id],
        [layerId]: value,
      },
    }));
  };

  const handleGenerateReflection = (layerId: LayerId) => {
    const currentDraft = drafts[selectedModule.id]?.[layerId] ?? "";
    if (!currentDraft.trim()) {
      return;
    }

    const layerConfig = LAYERS.find((layer) => layer.id === layerId);
    const previousCard = moduleReflections.find((card) => card.layerId === layerId);
    const previousDraft =
      typeof previousCard?.draftLength === "number"
        ? "x".repeat(previousCard.draftLength)
        : undefined;

    const card = generateReflectionCard({
      moduleId: selectedModule.id,
      moduleTitle: selectedModule.title,
      layerId,
      layerLabel: layerConfig?.label ?? layerId,
      currentDraft,
      previousDraft,
      existingInsightTypes: moduleReflections.map((item) => item.insightType),
    });

    setReflectionCards((prev) => ({
      ...prev,
      [selectedModule.id]: [card, ...(prev[selectedModule.id] ?? [])],
    }));
  };

  const compiledSynthesis = useMemo(() => {
    if (!selectedModule) return "";
    const moduleDrafts = drafts[selectedModule.id];
    return LAYERS.map((layer) => {
      const content = moduleDrafts?.[layer.id];
      if (!content?.trim()) {
        return null;
      }
      return `### ${layer.label} (${layer.focus})\n${content.trim()}`;
    })
      .filter(Boolean)
      .join("\n\n");
  }, [drafts, selectedModule]);

  const progressSnapshot = useMemo(
    () => buildProgressSnapshot(moduleReflections),
    [moduleReflections],
  );

  const copyToClipboard = async () => {
    if (!compiledSynthesis) return;
    try {
      await navigator.clipboard.writeText(compiledSynthesis);
    } catch (error) {
      console.error("Failed to copy prompt:", error);
    }
  };

  if (!selectedModule) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute left-1/3 top-[-120px] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-[-80px] bottom-[-120px] h-[26rem] w-[26rem] rounded-full bg-emerald-500/10 blur-[180px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.16),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.12]" />
      </div>

      <main className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-20 sm:px-6">
        <header className="space-y-4 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-cyan-200/70">
            ASTRA · Prompt Builder Labs
          </p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">ILM Layered Prompt Builder</h1>
          <p className="mx-auto max-w-2xl text-sm text-white/70 sm:text-base">
            Choose a micro-learning module, work through each ILM layer, and assemble an export-ready
            artefact. The framework cues on the right keep your prompts grounded in ASTRA’s methodology.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Select a module</p>
              <div className="mt-4 flex flex-col gap-4 sm:grid sm:grid-cols-2">
                {MODULES.map((module) => {
                  const isActive = module.id === selectedModule.id;
                  return (
                    <button
                      key={module.id}
                      type="button"
                      onClick={() => setSelectedModuleId(module.id)}
                      className={`rounded-2xl border px-4 py-4 text-left transition-all ${
                        isActive
                          ? "border-cyan-300/50 bg-cyan-300/15 shadow-[0_0_35px_rgba(34,211,238,0.25)]"
                          : "border-white/10 bg-white/5 hover:border-cyan-300/30 hover:bg-cyan-300/10"
                      }`}
                    >
                      <p className="text-sm font-semibold text-white">{module.title}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50">
                        {module.theme}
                      </p>
                      <p className="mt-2 text-xs text-white/70 line-clamp-3">{module.objective}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{selectedModule.title}</h2>
                  <p className="mt-2 text-sm text-white/70">{selectedModule.objective}</p>
                </div>
                <div className="rounded-full border border-cyan-300/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-100/80">
                  Output · {selectedModule.output}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedModule.frameworks.map((frameworkId) => {
                  const framework = FRAMEWORKS[frameworkId];
                  if (!framework) return null;
                  return (
                    <span
                      key={frameworkId}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70"
                    >
                      {framework.name}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              {LAYERS.map((layer) => {
                const config = selectedModule.layers[layer.id];
                const value = drafts[selectedModule.id]?.[layer.id] ?? "";
                const latestCard = moduleReflections.find((card) => card.layerId === layer.id);
                const governanceResult = runGovernanceScan({
                  moduleId: selectedModule.id,
                  layerId: layer.id,
                  content: value,
                });
                const governanceTone =
                  governanceResult.category === "Safe"
                    ? "text-emerald-300"
                    : governanceResult.category === "Moderate"
                      ? "text-amber-200"
                      : governanceResult.category === "High"
                        ? "text-orange-200"
                        : "text-rose-200";
                const primarySuggestion = governanceResult.suggestions.at(0);
                return (
                  <div
                    key={layer.id}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:border-cyan-300/30"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
                            {layer.label} · {layer.focus}
                          </p>
                          <span className={`text-[10px] uppercase tracking-[0.3em] ${governanceTone}`}>
                            Governance {governanceResult.category} ({governanceResult.score})
                          </span>
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-white">{config.headline}</h3>
                        <p className="mt-2 text-sm text-white/70">{config.instructions}</p>
                        {primarySuggestion ? (
                          <p className="mt-2 text-xs text-white/50">
                            Tip: {primarySuggestion.label} — {primarySuggestion.action}
                          </p>
                        ) : null}
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/40">
                        {layer.tone}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                        {config.prompt}
                      </p>
                      <textarea
                        value={value}
                        onChange={(event) => handleLayerChange(layer.id, event.target.value)}
                        placeholder={config.placeholder}
                        rows={layer.id === "synthesis" ? 8 : 5}
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white/90 placeholder:text-white/40 focus:border-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
                      />
                      <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                          type="button"
                          onClick={() => handleGenerateReflection(layer.id)}
                          className="inline-flex items-center justify-center rounded-full border border-cyan-300/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-100/80 transition hover:bg-cyan-300/10"
                        >
                          Log reflection card
                        </button>
                        {latestCard ? (
                          <span className="text-[11px] text-white/50">
                            Latest insight:{" "}
                            <span className="font-semibold text-white/70">{latestCard.summary}</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-white/40">
                            No reflections logged yet for this layer.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Progress snapshot</p>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
                  Layers {progressSnapshot.totalLayersCompleted}
                </span>
              </div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">Cards collected</p>
                  <p className="mt-1 text-lg font-semibold text-white">{progressSnapshot.cardsCollected}</p>
                </div>
                <div className="space-y-2">
                  {(
                    Object.entries(progressSnapshot.skillTotals) as Array<[string, number]>
                  ).map(([skill, count]) => (
                    <div key={skill}>
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-white/50">
                        <span>{skill}</span>
                        <span>{count}</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-500"
                          style={{ width: `${Math.min(100, count * 16)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-white/40">
                  {progressSnapshot.lastUpdated
                    ? `Last updated ${new Date(progressSnapshot.lastUpdated).toLocaleString()}`
                    : "Reflection deck ready for your first insight."}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Reflection deck</p>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
                  {moduleReflections.length ? "Latest" : "Empty"}
                </span>
              </div>
              <div className="mt-3 max-h-[240px] space-y-3 overflow-y-auto pr-1">
                {moduleReflections.length === 0 ? (
                  <p className="text-sm text-white/50">
                    Log reflections layer by layer to build your mastery record.
                  </p>
                ) : (
                  moduleReflections.slice(0, 6).map((card) => (
                    <div
                      key={card.cardId}
                      className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3"
                    >
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-white/50">
                        <span>{card.layerLabel}</span>
                        <span>{card.insightType}</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-white">{card.summary}</p>
                      <p className="mt-1 text-xs text-white/60">{card.narrative}</p>
                      {typeof card.metricDelta === "number" ? (
                        <p className="mt-1 text-[11px] text-emerald-200">
                          Metric shift {card.metricDelta >= 0 ? "+" : ""}
                          {card.metricDelta}%
                        </p>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Framework cues</p>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
                  Reference · read only
                </span>
              </div>
              <div className="mt-4 space-y-4">
                {selectedModule.frameworks.map((frameworkId) => {
                  const framework = FRAMEWORKS[frameworkId];
                  if (!framework) return null;
                  return (
                    <div key={frameworkId} className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                      <p className="text-sm font-semibold text-white">{framework.name}</p>
                      <p className="mt-1 text-xs text-white/60">{framework.summary}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {framework.cues.map((cue) => (
                          <span
                            key={cue}
                            className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.3em] text-white/60"
                          >
                            {cue}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Synthesis preview</p>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  disabled={!compiledSynthesis}
                  className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] transition ${
                    compiledSynthesis
                      ? "border-cyan-300/40 text-cyan-100/80 hover:bg-cyan-300/10"
                      : "border-white/10 text-white/30"
                  }`}
                >
                  Copy
                </button>
              </div>
              <div className="mt-3 max-h-[320px] overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-xs text-white/70">
                {compiledSynthesis ? (
                  <pre className="whitespace-pre-wrap">{compiledSynthesis}</pre>
                ) : (
                  <p className="text-white/40">Fill in the layers to assemble your mega prompt.</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Reflection prompts</p>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                {selectedModule.reflectionPrompts.map((prompt) => (
                  <li key={prompt} className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2">
                    {prompt}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/50 p-6 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Export notes</p>
              <p className="mt-2 text-xs text-white/60">
                Combine this synthesis with ASTRA’s export utilities to generate Markdown packs, JSON
                artefacts, or LMS-ready content. Remember to include attribution when sharing externally.
              </p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
                {getFullVersionInfo()}
              </p>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
