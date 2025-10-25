# **ASTRA – Awareness, Security & Threat Response Assistant (POC)**

ASTRA is an AI-assisted tool designed to help organisations quickly create security awareness content, phishing simulations, and summaries of real-world cyber events. It is built for busy Security, IT, and Governance teams who don’t have the time or resources to manually create this material.

> ⚠ **Note:** This is a Proof of Concept (POC) — not a production security tool. All content should be manually reviewed before use.

---

## 🚀 **Purpose**

ASTRA provides a time-saving assistant to support:
- Security awareness campaigns  
- Phishing simulations and training exercises  
- Executive or staff-friendly summaries of cyber events  
- Plain-English explanations of frameworks like ISO 27001, CE+, NIS2  

This tool is not designed to replace security systems — it enhances communication, awareness, and response preparedness.

---

## 🎯 **Project Goals**

- Develop a simple, working POC web application.
- Use **Next.js + TypeScript + Tailwind CSS** for the front-end.
- Use AI models (**Claude/ChatGPT/OpenAI**) to generate content (phishing templates, news summaries, awareness emails).
- Build in **small, testable stages** with clear outcomes.
- Use **Supabase or similar backend (optional)** for user registration, logging, and storing generated content.
- Style and branding will later align with the **Version 1 design style**:  
  https://www.version1.com/data-ai/
- Include:  
  ✅ Registration form  
  ✅ Cookie-based session handling  
  ✅ Auto timeouts (later phase)  
  ✅ Optional marketing follow-up consent

---

## 🧠 **Core Features (Planned for POC)**

| Feature | Description | Output |
|---------|-------------|--------|
| **Security Pulse** | AI-generated summaries of current cyber threats, breaches, or news | Email draft, Viva post, slide bullets |
| **Phishing Simulation Builder** | Generate realistic phishing email templates + landing page text | HTML email, simulation text |
| **Awareness Content Generator** | Convert links/articles into awareness posts | Email, blog/Viva post, poster-style text |
| **Knowledge Explainer** | Explain ISO 27001/CE+/NIS2/cyber topics in human language | FAQ, paragraphs, bullet list |
| **User Registration & Tracking (later)** | Basic accounts, consent capture, usage logs | Stored in Supabase / mock system |

---

## ⚖️ **Compliance, Legal & Disclaimer Requirements**

The POC must include:
- ✅ **Disclaimer:** “ASTRA is a proof-of-concept tool. Use at your own discretion. It is not a certified security product.”
- ✅ **GDPR Notice:** Registration data is used only for demonstration, feedback, and optional marketing follow-up.
- ✅ **Source Transparency:** Any AI-generated content based on news must reference source links if applicable.
- ✅ **Liability Clause:** “Version 1 / Developers accept no liability for decisions made using output from this tool.”

---

## 🛠 **Development Stages**

### **Stage 1 – Structure & Navigation**
- Set up Next.js + TypeScript + Tailwind  
- Create pages: `/`, `/dashboard`, `/pulse`, `/phishing`, `/awareness`, `/login`  
- Add header + Version1-style layout (minimal)

### **Stage 2 – Mock Functionality**
- Add simple forms + “Generate” buttons on each module  
- Create `/api/ai` route with static mock data  
- Display results on each page

### **Stage 3 – Real AI Integration**
- Configure `.env.local` with API keys  
- Replace mock generator with calls to AI (Claude/OpenAI)  
- Use consistent JSON response structure for UI

### **Stage 4 – Accounts, Logging & Sessions**
- Add registration & login page (email/password or passcode)  
- Store user + consent in Supabase or local mock DB  
- Track module usage (audit log)

### **Stage 5 – Styling, GDPR & Disclaimers**
- Apply Version 1 styling  
- Add disclaimers, consent text, footer, cookie banner  
- Refine layout, spacing, and call-to-actions

---

## ✅ **Tech Stack (for POC)**

| Layer | Technology |
|-------|------------|
| Front-End | Next.js, TypeScript, Tailwind CSS |
| Backend (Light) | Next.js API Routes (optional Supabase integration) |
| AI Integration | Claude API / OpenAI API |
| Authentication | Phase 4 – Email/Passcode or Supabase Auth |
| Hosting (optional) | Vercel or Azure Web App |
| Version Control | Git + GitHub (repo: `1Zero9/astra-web`) |

---

## ✅ **Status: In Progress**
✔ Planning
✔ Requirements, architecture and roadmap defined
✔ Stage 1: Project structure & navigation
✔ Stage 2: Mock API + UI
⬜ Stage 3: AI integration
⬜ Stage 4: Accounts & logging
⬜ Stage 5: Styling & disclaimers

---

## 📌 **Next Actions**
1. Initialise project structure (Next.js + Tailwind + TypeScript)  
2. Create base pages + navigation  
3. Integrate mock `/api/ai` endpoint  
4. Test navigation and UI flows locally  
5. Begin adding AI content generation

---

## 📄 **Disclaimer**
This is a **Proof of Concept (POC)**. ASTRA does **not** replace security systems, threat monitoring platforms, or certified training solutions. All generated content should be reviewed by a qualified security professional.

---

## 📬 **Contact / Author**
Built by: **Stephen Cranfield**  
Version 1 – Security, Governance & AI Innovation

---

