# 🪞 ASTRA Reflection Card & Progress Tracker Specification
**Project:** ASTRA – Awareness, Security & Threat Response Assistant  
**Component:** ILM Reflection & Analytics  
**Purpose:** Define structure, logic, and experience for the Reflection Card system and the overall Progress Tracker within ASTRA’s ILM framework.

---

## 🎯 Objective
To design a feedback and progress experience that reinforces learning, boosts engagement, and tracks mastery without traditional gamification clutter.  
Reflection Cards capture insights and micro-achievements after each ILM layer; the Progress Tracker visualises these improvements over time.

---

## 🧠 1. Reflection Cards
Reflection Cards provide **instant feedback** after each ILM layer is completed.

### Format
| Field | Description |
|--------|--------------|
| **Title** | Auto-generated summary (“Prompt clarity improved by 26%”) |
| **Layer** | ILM layer number (L0–L5) |
| **Insight Type** | Skill area: Clarity, Empathy, Governance, Creativity, Structure |
| **Description** | Short, encouraging reflection with concrete takeaway |
| **Metric (optional)** | Simple visual bar (e.g., 4/5 clarity stars) |
| **Badge (optional)** | Minor achievement icon for layer completion |
| **Date/Time** | ISO timestamp |

### Example Card
> **Layer 2 – Roleplay Insight**  
> Your role definition added purpose and direction. Prompts that include a defined audience score 38% higher in clarity.  
> ⭐ Clarity +38% | 🕓 21:47 | 🧠 Reflection saved.

### Tone Guidelines
- Encouraging and educational (“You clarified purpose, not just task”).
- Reference professional improvement metrics.
- Optional humour or cinematic nods to the ILM theme (“Descending deeper unlocked clarity”).

### Trigger Logic
- Generated automatically after user completes each ILM layer.
- Gemini/GPT evaluates delta between input fields to suggest measurable progress.
- Stored locally (or Supabase table `reflection_cards`) with user/session linkage.

---

## 📊 2. Progress Tracker
Visual and data-driven component showing evolution across sessions.

### Key Metrics
| Metric | Definition |
|---------|-------------|
| **Prompts Created** | Total prompts completed. |
| **Layers Completed** | Count of ILM layer submissions. |
| **Reflection Cards Collected** | Number of cards generated. |
| **Skill Focus Map** | Weighted distribution (Clarity, Creativity, Governance, etc.). |
| **Learning Streak** | Consecutive active days/weeks. |
| **Mastery Level** | Calculated score (0–100%) combining quantity + diversity. |

### Display Concepts
1. **Radial Skill Map** – interactive web chart (D3/Recharts).  
   - Each axis = skill area.  
   - Gradually fills as user gains insights.
2. **Timeline View** – horizontal scrollable “journey.”  
   - Cards displayed as nodes with time/date and small progress glow.
3. **Profile Summary Pane** – dashboard snapshot:  
   - “You’ve completed 14 ILM layers and collected 8 Reflection Cards. Governance strength +12% since last session.”

---

## 🧩 3. Progression System (Badges & Levels)
Lightweight recognition system focused on learning, not competition.

### Example Badges
| Badge | Trigger | Theme |
|--------|----------|--------|
| **Clarity Seeker** | Complete 3 layers focused on clarity. | Learning foundation |
| **Governance Guardian** | Finish Governance & Ethics module. | Compliance awareness |
| **Empathy Architect** | Improve audience context in 5+ prompts. | Human-centric design |
| **AI Alchemist** | Fuse two frameworks using Meta Composer. | Creativity |
| **Insight Voyager** | Collect 20 Reflection Cards. | Mastery milestone |

Badges appear as minimal glowing icons; users can click to reveal short narrative (“You’ve mastered reflection through depth and empathy.”).

---

## 📈 4. Technical Design Overview
### Data Schema (Conceptual)
```json
{
  "user_id": "uuid",
  "reflection_cards": [
    {
      "card_id": "uuid",
      "layer": "L1",
      "insight_type": "Clarity",
      "description": "Defined context improved prompt precision.",
      "metric": 0.38,
      "timestamp": "2025-11-01T17:20:00Z"
    }
  ],
  "progress": {
    "total_layers": 12,
    "cards_collected": 8,
    "skills": {
      "Clarity": 0.65,
      "Empathy": 0.45,
      "Governance": 0.25,
      "Creativity": 0.5
    },
    "last_updated": "2025-11-01T17:25:00Z"
  }
}
```

### Storage
- Supabase table `ilm_reflection_cards` with relationships to `ilm_sessions`.
- Optional local browser cache for quick retrieval.
- Progressive sync on login.

### Analytics Engine (Optional Future)
- Compute rolling averages per skill area.
- Display “Top skill this week” insight on Dashboard.

---

## 🎨 5. UX / Visual Design
- Each Reflection Card slides in with smooth fade/pulse animation.
- Palette matches ILM theme (deep blue–violet gradient with warm highlights).
- Cards stack in a “Reflection Deck” users can flip through.
- Progress Tracker uses clean geometric charts; visual calm, not noise.
- Add motivational copy:  
  > “Progress isn’t speed — it’s depth.”  
  > “Every reflection is a step toward mastery.”

---

## 🌐 6. Integration Points
- **ILM Wizard:** triggers reflection card generation per layer.  
- **Dashboard:** displays summary metrics and skill map.  
- **ASTRA Pulse:** can surface one random reflection as a daily reminder.  
- **Community (future):** users may share Reflection Cards publicly with anonymised insights.

---

## ✅ 7. Next Steps
1. Prototype Reflection Card component in UI.
2. Define Supabase schema + connection logic.
3. Design radial skill map and timeline views.
4. Draft sample copy for 10 reflection cards (Clarity, Creativity, Governance, Empathy).
5. Integrate card generation into ILM completion flow.

---

> *ASTRA reflects the learner’s growth back at them — every prompt, every layer, a mirror of understanding.*