# ASTRA - Project Roadmap

**Awareness, Security & Threat Response Assistant**

---

## 🎯 Project Vision

ASTRA is an AI-powered tool designed to help organizations create security awareness content, analyze threats, and improve cybersecurity communication. It assists Security, IT, and Governance teams in quickly producing high-quality content without requiring extensive manual effort.

---

## ✅ Completed Features

### Security Pulse (v1.0)
**Status:** ✅ Production Ready

- **Real-time Security News Aggregation**
  - RSS feed integration from multiple cybersecurity sources
  - Automatic deduplication and sorting by date
  - Read/unread tracking with localStorage
  - New article detection and highlighting

- **Smart Filtering**
  - Filter by publication source
  - Search by vendor/company name
  - Keyword-based filtering
  - Active filter display with easy removal

- **Trending Topics Detection**
  - Automatic keyword extraction
  - Cross-source topic correlation
  - Visual trending indicators for breaking news

- **AI Content Generation**
  - Multiple content types:
    - Security Awareness Emails
    - Executive Summaries
    - Team Briefings
    - Viva Engage Posts
    - Slide Bullets
  - Customizable focus areas and tone
  - Google Gemini 2.5 Flash integration
  - Glass overlay loading animation

- **Content History**
  - Database-backed content storage
  - View previously generated content
  - Copy to clipboard functionality
  - Delete old content

- **Dynamic RSS Source Management**
  - Add/remove RSS sources via UI
  - Enable/disable sources without deletion
  - Database-backed source configuration
  - Default sources pre-seeded

### Infrastructure
**Status:** ✅ Production Ready

- **Database Integration**
  - PostgreSQL via Neon (serverless)
  - Prisma ORM for type-safe queries
  - Models: User, SavedArticle, GeneratedContent, UserPreferences, RSSSource
  - Guest user system for pre-authentication usage

- **Tech Stack**
  - Next.js 16 with Turbopack
  - TypeScript for type safety
  - Tailwind CSS 4 for styling
  - Google Generative AI SDK
  - Deployed on Vercel

### Branding
**Status:** ✅ Complete

- 1Zero9 branding and copyright (2025)
- Custom logo and favicon
- Consistent color scheme and design language

---

## 🚧 In Development

### Prompt Builder (NEW)
**Status:** 📋 Planned
**Priority:** High
**Target:** Q1 2025

A guided interface to help users construct effective AI prompts using proven methodologies.

**Features:**
- **Methodology Selection**
  - CLEAR (Context, Limitations, Examples, Audience, Role)
  - RISEN (Role, Instructions, Steps, End goal, Narrowing)
  - COAST (Context, Objective, Actions, Scenario, Task)
  - CRAFT (Context, Request, Action, Format, Target)
  - CREATE (Character, Request, Examples, Adjustments, Type, Extras)
  - RTF (Role, Task, Format)
  - Basic/Simple (streamlined version)

- **Dynamic Form Builder**
  - Methodology-specific input fields
  - Real-time prompt preview
  - Field descriptions and examples
  - Optional/required field indicators

- **Input Categories**
  - Subject/topic
  - Context and background
  - Desired output format
  - What to include
  - What to exclude/avoid
  - Target audience
  - Tone and style
  - Length/constraints
  - Role/persona for AI

- **Output & Export**
  - Real-time prompt assembly
  - Copy to clipboard
  - Save prompts to history
  - Export as text or markdown
  - Template library for common use cases

- **Educational Content**
  - Explanation of each methodology
  - Best practices and tips
  - Example prompts for each method
  - Common pitfalls to avoid

**Technical Implementation:**
- New route: `/prompt-builder`
- Database model: `SavedPrompt` (userId, methodology, promptText, metadata, createdAt)
- API: `/api/prompts` (CRUD operations)
- Integration with existing content generation features

---

## 🔮 Planned Features

### Phishing Simulator
**Status:** 🎨 UI Complete, Needs Backend
**Priority:** High
**Target:** Q1 2025

Generate realistic phishing email templates for training exercises.

**Planned Features:**
- Multiple scenario types (password reset, IT support, package delivery, payroll, executive communication)
- Sophistication levels (basic, intermediate, advanced)
- Red flags inclusion option for training
- Landing page content generation
- HTML email template export
- Training materials generation

### Awareness Content Generator
**Status:** 🎨 UI Complete, Needs Backend
**Priority:** High
**Target:** Q1 2025

Transform articles and links into engaging security awareness content.

**Planned Features:**
- URL or text input
- Multiple content types (email, blog/Viva post, poster, social media)
- Tone customization
- Web scraping for article content
- Image suggestion for visual content
- Multi-language support

### Knowledge Explainer
**Status:** 💡 Concept Phase
**Priority:** Medium
**Target:** Q2 2025

Explain complex compliance frameworks and security concepts in plain English.

**Planned Features:**
- Framework support (ISO 27001, NIS2, GDPR, SOC 2, etc.)
- Multiple explanation depths (ELI5, intermediate, technical)
- Comparison mode (compare frameworks)
- Checklist generator
- Gap analysis assistant
- Customizable output formats (FAQ, guide, presentation)

### User Authentication
**Status:** 💡 Concept Phase
**Priority:** Medium
**Target:** Q2 2025

Full user account management and personalization.

**Planned Features:**
- Email/password authentication
- OAuth integration (Google, Microsoft)
- User profiles and preferences
- Personal content history
- Saved RSS sources per user
- Usage analytics and insights
- Multi-tenant support for organizations

### Dashboard & Analytics
**Status:** 📋 Placeholder Exists
**Priority:** Low
**Target:** Q2 2025

Centralized overview of usage and insights.

**Planned Features:**
- Usage statistics
- Generated content overview
- Recent activity feed
- Trending topics summary
- Quick actions
- Saved templates
- Team collaboration features (future)

---

## 🏗️ Technical Roadmap

### Phase 1: Core Features (Q1 2025)
- ✅ Security Pulse with AI generation
- ✅ Database integration
- ✅ RSS source management
- 🚧 Prompt Builder
- 🔜 Phishing Simulator backend
- 🔜 Awareness Content backend

### Phase 2: Authentication & Personalization (Q2 2025)
- User authentication system
- User preferences and settings
- Personal content libraries
- Multi-user support

### Phase 3: Advanced Features (Q3 2025)
- Knowledge Explainer
- Advanced analytics
- Template marketplace
- API access for integrations

### Phase 4: Enterprise Features (Q4 2025)
- Multi-tenant architecture
- Team collaboration
- Admin dashboard
- Audit logging and compliance
- SSO integration

---

## 📊 Current Status Summary

| Feature | Status | Progress |
|---------|--------|----------|
| Security Pulse | ✅ Complete | 100% |
| Database Integration | ✅ Complete | 100% |
| RSS Source Management | ✅ Complete | 100% |
| Prompt Builder | 📋 Planned | 0% |
| Phishing Simulator | 🎨 UI Only | 20% |
| Awareness Generator | 🎨 UI Only | 20% |
| Knowledge Explainer | 💡 Concept | 0% |
| User Authentication | 💡 Concept | 0% |
| Dashboard | 📋 Placeholder | 5% |

---

## 🎓 Methodology Details for Prompt Builder

### CLEAR Framework
- **C**ontext: Background information
- **L**imitations: Constraints and boundaries
- **E**xamples: Sample inputs/outputs
- **A**udience: Who is this for?
- **R**ole: What role should AI adopt?

### RISEN Framework
- **R**ole: Define AI's persona
- **I**nstructions: Clear directives
- **S**teps: Break down the task
- **E**nd goal: Desired outcome
- **N**arrowing: Specific focus areas

### COAST Framework
- **C**ontext: Situational background
- **O**bjective: What you want to achieve
- **A**ctions: Steps to take
- **S**cenario: Specific use case
- **T**ask: Concrete deliverable

### CRAFT Framework
- **C**ontext: Set the scene
- **R**equest: What you're asking for
- **A**ction: What AI should do
- **F**ormat: How to structure output
- **T**arget: End audience

### CREATE Framework
- **C**haracter: AI's role/personality
- **R**equest: Main ask
- **E**xamples: Reference materials
- **A**djustments: Fine-tuning parameters
- **T**ype: Content format
- **E**xtras: Additional requirements

### RTF (Role-Task-Format)
Simplified framework:
- **R**ole: Who is the AI?
- **T**ask: What needs to be done?
- **F**ormat: How should output look?

---

## 📝 Contributing & Feedback

This is an evolving roadmap. Features and timelines may change based on:
- User feedback
- Technical discoveries
- Resource availability
- Emerging security trends

---

**Built by 1Zero9**
**© 2025 - Proof of Concept**

Last Updated: October 29, 2025
