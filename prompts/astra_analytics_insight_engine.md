# 📊 ASTRA Analytics & Insight Engine Specification
**Project:** ASTRA – Awareness, Security & Threat Response Assistant  
**Component:** Analytics & Insight Engine  
**Purpose:** Define how ASTRA aggregates, analyses, and visualises user data — turning learning activity, reflections, and governance checks into meaningful insights and organisational intelligence.

---

## 🌐 Concept Overview
The **Analytics & Insight Engine (AIE)** is ASTRA’s analytical backbone. It transforms ILM learning interactions, Reflection Cards, Pulse engagement, and Governance Filter results into actionable insights for both individuals and organisations.

> **Tagline:** “Measure what matters — insight, not output.”

AIE operates on two levels:
1. **Personal Intelligence:** tracks user progress, learning patterns, and skill evolution.  
2. **Organisational Intelligence:** aggregates anonymised data to assess awareness, engagement, and governance health across teams.

---

## 🎯 Goals
1. Provide meaningful visibility into learning and behavioural trends.  
2. Support leadership decisions on awareness, training, and governance.  
3. Encourage individual reflection through transparent metrics.  
4. Integrate ethics and performance analytics into one unified view.

---

## 🧠 1. Data Sources
| Source | Description | Example Metrics |
|---------|--------------|------------------|
| **ILM Interactions** | Layer completion, time spent, framework use. | Layer completion rate, avg depth. |
| **Reflection Cards** | Individual insights and themes. | Reflection frequency, skill distribution. |
| **Pulse Feed Activity** | Engagement with challenges, insights, and resources. | Participation streak, challenge completion. |
| **Community Hub** | Shared prompts, remix activity, peer interactions. | Top frameworks, trending topics. |
| **Governance Filter (AEGF)** | Risk scores and ethics flags. | Compliance health index, flagged topics. |

---

## ⚙️ 2. Core Metrics & KPIs
### A. Individual Metrics
| Category | Example KPI |
|-----------|--------------|
| **Engagement** | Active sessions per week, ILM depth progression. |
| **Learning Growth** | Skill delta (Clarity +12%, Empathy +8%). |
| **Reflection Practice** | Cards per week, time to reflect. |
| **Governance Awareness** | % of prompts passing AEGF first time. |
| **Framework Fluency** | Diversity of frameworks used (CLEAR, RISEN, ILM, etc.). |

### B. Organisational Metrics
| Category | Example KPI |
|-----------|--------------|
| **Adoption** | % of staff using ASTRA monthly. |
| **Awareness** | Avg. reflections per department. |
| **Risk Posture** | Reduction in AEGF high-risk content. |
| **Cultural Maturity** | Leadership vs non-leadership engagement trends. |
| **Learning Heatmap** | Topics or skills with highest activity (e.g., Governance vs Empathy). |

---

## 📈 3. Visual Dashboards
### A. Personal Insight View
| Element | Description |
|----------|--------------|
| **Skill Radar Chart** | Plots growth across Clarity, Empathy, Governance, Creativity, Structure. |
| **Reflection Timeline** | Chronological progression of insights and milestones. |
| **Learning Streak Tracker** | Daily/weekly engagement counter. |
| **Ethics Gauge** | % compliance rate from Governance Filter. |
| **Mentor Highlights** | Short summaries from AstraCore (“Your top strength this month: Empathy.”). |

### B. Organisational Dashboard
| Element | Description |
|----------|--------------|
| **Adoption Metrics Panel** | User count, frequency, time-on-task. |
| **Engagement Heatmap** | Activity by team, region, or function. |
| **Governance Overview** | Average compliance score, top flagged risks. |
| **Framework Utilisation Map** | Visual breakdown of frameworks in use. |
| **Insight Feed** | Anonymised reflections summarised as themes (e.g., “Clarity improving, Governance lagging”). |

---

## 🧩 4. Data Architecture
### A. Schema (Simplified)
```json
{
  "user_id": "uuid",
  "metrics": {
    "engagement": {"sessions": 14, "ilm_layers_completed": 25},
    "skills": {"clarity": 0.72, "empathy": 0.55, "governance": 0.43},
    "compliance": {"avg_score": 18, "passed_first_try": 0.82},
    "reflections": {"cards_total": 45, "last_reflection": "2025-11-01"}
  },
  "org_aggregate": {
    "users": 127,
    "avg_learning_depth": 3.4,
    "governance_health": 0.78
  }
}
```

### B. Infrastructure
- **Supabase:** secure data store with user/org partitioning.
- **Analytics Engine:** serverless function computing deltas and KPIs daily.
- **Visualisation Layer:** Recharts or D3 via Next.js dashboard.
- **Export Tools:** CSV / PDF summaries for leadership reports.

---

## 💡 5. Insight Generation Logic
The Insight Engine goes beyond metrics — it *interprets* them.

| Trigger | Output |
|----------|---------|
| ILM Depth ≥ 4 | “You’ve mastered layered thinking — try Leadership Mode next.” |
| Governance Risk ↓ 20% | “Compliance improvement detected. Reflect on what changed.” |
| Skill Balance Skewed | “Your empathy prompts outpace clarity — refine balance for better outcomes.” |
| Inactivity > 7 days | “Your reflection streak paused — shall we continue your learning journey?” |

Insights are displayed in mentor voice (AstraCore) for continuity and tone consistency.

---

## 🧮 6. Analytics Methods
- **Time-series tracking** for learning patterns.  
- **Weighted averages** for multi-layer reflections.  
- **Topic modelling (optional)** for identifying emergent themes.  
- **Sentiment analysis** on reflections for engagement health.  
- **Governance correlation** to connect risk levels with learning depth.

---

## 🔍 7. Data Privacy & Ethics
- All analytics are **aggregated or anonymised** by default.  
- Personal data is pseudonymised and stored in compliance with GDPR/ISO 27701.  
- Transparency statement shown in Dashboard:  
  > “ASTRA analyses behaviour to improve your learning — never for external profiling or marketing.”

---

## 🎨 8. UX Principles
- Calm, data-light design — visual clarity > data overload.  
- Emphasis on storytelling (“Your growth this month”) rather than raw stats.  
- Export-friendly visuals for leadership decks.  
- Optional mentor overlay (“AstraCore summarises your insights in plain language”).

---

## 🔮 9. Future Evolution
1. **Predictive Learning Guidance** – suggest next ILM modules based on performance.  
2. **Organisational Benchmarking** – compare internal metrics to anonymised global data.  
3. **Pulse Trend Analytics** – visualise popular topics and skill surges.  
4. **Ethics Insights Dashboard** – detailed compliance view for governance leads.  
5. **AI-Coached Reports** – AstraCore generates executive summaries automatically.

---

## ✅ 10. Next Steps
1. Define metrics hierarchy (core vs advanced KPIs).  
2. Prototype individual dashboard UI.  
3. Implement analytics function for ILM + Reflection data.  
4. Build first Insight Card generator for AstraCore commentary.  
5. Develop governance summary export for leadership reporting.

---

> *ASTRA’s Analytics Engine turns awareness into intelligence — showing every learner, leader, and organisation how insight grows over time.*