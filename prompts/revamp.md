# 🧠 ASTRA UX + Developer Revamp Brief

### v1.0 – October 2025

**Project:** ASTRA — Awareness, Security & Threat Response Assistant
**Prepared by:** 1Zero9 Studio
**Goal:** Simplify and refocus the ASTRA UX to improve clarity, trust, and usability while streamlining the Next.js + Tailwind implementation.

---

## 🎯 Objective

The current ASTRA landing page attempts to do too much at once, introducing multiple modules (Security Pulse, Phishing Simulator, Awareness Content, Knowledge Explainer) without a clear user journey.
This brief aims to focus on one strong entry point, simplify navigation, and guide the user through a meaningful first experience — ideally starting with the *Phishing Simulation* feature.

---

## 🔍 Context

ASTRA is an AI-assisted assistant that helps IT, Security, and Governance teams quickly create:

* Security awareness content
* Phishing simulations
* Executive-friendly summaries of security events
* Plain-English breakdowns of compliance frameworks

It’s currently a **Proof of Concept (POC)**, but must still look professional and trustworthy.

---

## ⚠️ Key UX Issues

| Issue         | Description                                                             |
| ------------- | ----------------------------------------------------------------------- |
| 🎯 Focus      | The landing page has too many CTAs and modules, confusing new visitors. |
| 🧭 Hierarchy  | Everything appears visually equal; no single journey stands out.        |
| 👥 Targeting  | The audience and value proposition aren’t clearly defined.              |
| ⚠️ Disclaimer | The POC disclaimer dominates the top of the page, eroding trust.        |
| 🔗 Navigation | The layout mixes “marketing” and “app” areas, causing confusion.        |
| 🧩 Overload   | Too many “coming soon” blocks reduce impact and professionalism.        |

---

## 🪄 Redesign Principles

### 1. Simplify the Landing Page

Focus on **one flagship journey** — e.g. *AI-powered phishing simulation builder*.
Use a single clear CTA and emphasise benefits in plain English.

**Example:**

> “Create realistic phishing simulations in minutes — powered by AI.”

Include one big CTA:

> **[Try Demo]**

Keep other features (“Security Pulse”, “Awareness Content”) as teasers lower down the page.

---

### 2. Clean Navigation Structure

**Public Navigation:**

```
Home | Features | Demo | About
```

**Authenticated Navigation:**

```
Dashboard | Phishing Simulator | Security Pulse | Awareness Content | Profile
```

Hide or disable unfinished modules. Show badges like *Coming Soon* or *Early Access* where applicable.

---

### 3. Refine Copy & Messaging

* **Audience:** Security, IT, and Governance professionals who need quick awareness tools.
* **Tone:** Confident, concise, and helpful — not overly technical.
* **Example subheading:**

  > “Built for security and governance teams who need results fast — without the noise.”

Add a short **“How it Works”** section:

1. Choose your template
2. Generate using AI
3. Review & share with your team

---

### 4. Reposition the Disclaimer

Move the detailed disclaimer to the footer or *About* page.
Keep a short note on the main page only:

> “ASTRA is an AI proof of concept — always review generated content before use.”

---

### 5. Establish Visual Hierarchy

Use consistent spacing and accent colours to make the primary action stand out:

* Main button: solid accent blue (`#0b69ff`)
* Secondary: outlined grey or muted tone
* Text: large, readable, with plenty of breathing room
* Section spacing: Tailwind `space-y-12` or `mt-16` for rhythm

---

### 6. Future Feature Teasers

Display upcoming modules subtly:

```
## Coming Soon
🟦 Security Pulse — live threat summaries and trend insights  
🟨 Awareness Builder — auto-generated campaign content  
```

Add simple “Coming Q1 2026” or “In Preview” badges, not large panels.

---

## 💡 Optional Enhancements

* Rename modules for clarity and simplicity:

  * “Security Pulse” → “Threat Flash”
  * “Awareness Content” → “Comms Builder”
* Add progress badges like **Early Access** or **Beta**.
* Ensure full mobile responsiveness.
* Consider light/dark mode using Tailwind’s `dark:` classes.
* Add a minimal illustration or animated gif showing ASTRA in action.

---

## 🧱 Developer Implementation (Next.js + Tailwind)

### Phase 1 — Structure & Routing

* [ ] Create new public landing page: `src/app/(public)/home/page.tsx`
* [ ] Move logged-in app content under `src/app/(app)/dashboard/page.tsx`
* [ ] Update root layout (`layout.tsx`) to serve different navbars for public vs app routes.
* [ ] Create `/demo` route linking directly to the Phishing Simulator.

---

### Phase 2 — Components

* [ ] `HeroSection.tsx` — headline, sub, CTA button
* [ ] `HowItWorks.tsx` — simple 3-step section
* [ ] `ComingSoonSection.tsx` — badges for upcoming features
* [ ] `Footer.tsx` — short disclaimer + © 1Zero9 Studio
  Each component should live under `src/components/ui/` and follow Tailwind utility patterns.

---

### Phase 3 — Content & Copy

* [ ] Replace placeholder text with new messaging.
* [ ] Move POC disclaimer to `/about`.
* [ ] Update hero copy and CTAs to match the focused feature narrative.

---

### Phase 4 — Styling & Accessibility

* [ ] Apply Tailwind typography: `text-4xl font-semibold tracking-tight`.
* [ ] Ensure all CTAs have hover/focus states.
* [ ] Test contrast ratios (WCAG AA compliance).
* [ ] Validate responsiveness on mobile/tablet/desktop.

---

### Phase 5 — Testing & Deployment

* [ ] Confirm route navigation between landing → demo → dashboard.
* [ ] Verify footer disclaimer and about page links.
* [ ] Deploy preview to Vercel staging (`vercel --prod` after review).
* [ ] Update Cloudflare DNS if route structure changes.

---

## 🧭 Suggested Layout Example (Landing Page)

```tsx
<main className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-neutral-900">
  <HeroSection />
  <HowItWorks />
  <ComingSoonSection />
  <Footer />
</main>
```

**Hero Example Copy:**

```
AI-powered security awareness in minutes.  
Create phishing simulations and awareness content instantly.  
[Try Demo]
```

---

## 📦 Deliverables

* ✅ Updated landing page (Next.js + Tailwind)
* ✅ Simplified navigation structure
* ✅ Clear visual hierarchy with focused CTA
* ✅ Revised copy and disclaimer placement
* ✅ Modularised UI components for scalability

---

## 🧭 Style & Tone Guidance

Keep it:

* Clean, modern, and professional
* White space heavy, Apple/Notion inspired
* Accessible and mobile-first

Avoid:

* Loud gradients or neon backgrounds
* Multiple CTAs of equal weight
* Walls of text or “coming soon” boxes that distract

---

## 🧭 Outcome

After applying this brief:

* Users immediately understand **what ASTRA does** and **who it’s for**.
* The product feels cohesive and trustworthy, even as a POC.
* Navigation is intuitive and scalable for future modules.
* The design reflects 1Zero9’s clean, AI-driven design ethos.

---

### ✅ Primary Goal

Deliver a **focused, high-trust UX** that communicates one clear message:

> **AI-assisted security awareness, simplified.**

---

© 2025 1Zero9 Studio · ASTRA UX Revamp Brief
