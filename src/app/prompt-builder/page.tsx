"use client";

import { useState } from "react";
import { getFullVersionInfo } from "@/lib/version";

type PromptTemplate = {
  id: string;
  name: string;
  description: string;
  template: string;
  category: 'learning' | 'meta' | 'task' | 'creative' | 'leadership';
};

const templates: PromptTemplate[] = [
  {
    id: 'eli5',
    name: 'ELI5 (Explain Like I\'m 5)',
    description: 'Get simple explanations of complex topics',
    template: 'Context: I need to understand [TOPIC] but I\'m completely new to this subject. My background is [YOUR BACKGROUND/EXPERIENCE LEVEL].\n\nRole: Act as a patient teacher who excels at breaking down complex ideas into simple, relatable concepts.\n\nTask: Explain [TOPIC] in simple terms that a 5-year-old could understand. Use everyday analogies, avoid jargon, and check my understanding by asking me a simple question at the end.',
    category: 'learning'
  },
  {
    id: 'deep-dive',
    name: 'Deep Dive Analysis',
    description: 'Comprehensive exploration of a topic',
    template: 'Context: I need a comprehensive understanding of [TOPIC]. My goal is to [WHAT YOU WANT TO DO - e.g., make a decision, write a report, understand for a project].\n\nRole: Act as a subject matter expert with deep knowledge of [TOPIC]. Your job is to provide thorough analysis while highlighting what matters most.\n\nInterview: Before diving deep, ask me 1-2 questions to understand what aspects of [TOPIC] are most relevant to my goal.\n\nTask: Provide a comprehensive analysis covering:\n1. Overview and context\n2. Key concepts and principles\n3. Current trends and developments\n4. Practical applications for my situation\n5. Future implications and what to watch',
    category: 'learning'
  },
  {
    id: 'learning-path',
    name: 'Custom Learning Path',
    description: 'Create a personalized learning roadmap',
    template: 'Context: I want to learn [TOPIC/SKILL]. My current level is [BEGINNER/INTERMEDIATE/ADVANCED]. I have [TIME AVAILABLE] per week to dedicate to learning.\n\nRole: Act as a learning strategist and curriculum designer who creates personalized learning paths.\n\nInterview: Ask me 2-3 questions about my learning style, goals, and what success looks like for me.\n\nTask: Design a custom learning path including:\n1. Learning objectives and milestones\n2. Recommended resources (ordered by priority)\n3. Weekly practice exercises\n4. Progress checkpoints\n5. Common pitfalls to avoid',
    category: 'learning'
  },
  {
    id: 'concept-compare',
    name: 'Concept Comparison',
    description: 'Understand differences between similar concepts',
    template: 'Context: I\'m confused about the difference between [CONCEPT A] and [CONCEPT B]. I need to understand when to use each one in [YOUR CONTEXT].\n\nRole: Act as an expert educator who specializes in clarifying confusing concepts.\n\nTask: Compare and contrast these concepts:\n1. Clear definitions of each\n2. Key differences and similarities\n3. When to use each one\n4. Real-world examples\n5. A decision tree or framework to help me choose',
    category: 'learning'
  },
  {
    id: 'step-by-step',
    name: 'Step-by-Step Guide',
    description: 'Break down complex processes',
    template: 'Context: I need to accomplish [TASK]. My experience level is [BEGINNER/INTERMEDIATE/ADVANCED]. I have access to [TOOLS/RESOURCES].\n\nRole: Act as an expert instructor who creates clear, actionable guides.\n\nInterview: Ask me 1-2 questions about my constraints or what I\'m most worried about.\n\nTask: Create a detailed step-by-step guide including:\n- Prerequisites and preparation\n- Clear numbered steps with success criteria\n- Expected outcomes at each stage\n- Common pitfalls specific to my experience level\n- Troubleshooting tips',
    category: 'task'
  },
  {
    id: 'meta-prompt',
    name: 'Meta Prompt Generator',
    description: 'Create prompts that generate better prompts',
    template: 'Context: I want to create a prompt for: [GOAL]. The audience is [WHO WILL USE IT]. The desired outcome is [SPECIFIC RESULT].\n\nRole: You are a prompt engineering expert who understands the CRIT framework (Context, Role, Interview, Task) and how to structure prompts for maximum effectiveness.\n\nInterview: Ask me 2-3 questions to understand:\n- What makes this prompt challenging\n- What the AI needs to know\n- How the output will be used\n\nTask: Generate an optimized prompt that:\n1. Provides rich context\n2. Assigns a clear expert role\n3. Uses Interview mode if helpful\n4. Defines specific deliverables\n5. Includes success criteria\n\nAfter generating the prompt, explain WHY each element makes it more effective.',
    category: 'meta'
  },
  {
    id: 'prompt-improver',
    name: 'Prompt Improver',
    description: 'Transform weak prompts into expert-level prompts',
    template: 'Context: I have a prompt that isn\'t giving me good results. Here\'s my current prompt:\n[PASTE YOUR WEAK PROMPT HERE]\n\nRole: Act as a prompt engineering coach who transforms "Google search" style prompts into expert prompts using the CRIT framework.\n\nTask: \n1. Analyze what\'s missing from my prompt\n2. Ask me clarifying questions to add context\n3. Rewrite the prompt with Context, Role, Interview, and Task\n4. Explain the before/after improvement\n5. Show me the pattern so I can do this myself next time',
    category: 'meta'
  },
  {
    id: 'chain-of-thought',
    name: 'Chain of Thought',
    description: 'Encourage step-by-step reasoning',
    template: 'Context: I need to solve [PROBLEM]. This is important because [WHY IT MATTERS]. I\'ve tried [WHAT YOU\'VE TRIED] but need a systematic approach.\n\nRole: Act as a strategic problem solver who uses chain-of-thought reasoning to work through complex challenges.\n\nTask: Solve this problem using step-by-step reasoning:\n1. First, analyze what we know and what assumptions we\'re making\n2. Then, identify what we need to find and any constraints\n3. Next, explore different approaches and their trade-offs\n4. Apply the best approach with clear logic\n5. Verify the solution and identify potential weaknesses\n\nShow your thinking at each step - don\'t jump to conclusions.',
    category: 'task'
  },
  {
    id: 'role-based',
    name: 'Expert Perspective',
    description: 'Get specialized viewpoints on topics',
    template: 'Context: I\'m working on [SITUATION/PROJECT]. I need expert insight on [SPECIFIC ASPECT]. My background is [YOUR EXPERIENCE].\n\nRole: You are a [SPECIFIC EXPERT - e.g., Senior Security Architect, UX Researcher, etc.] with 15+ years of experience. Share your expert perspective drawing on your specialized knowledge.\n\nInterview: Ask me 1-2 questions to understand the nuances of my situation.\n\nTask: Provide your expert perspective including:\n- How you would approach this based on your experience\n- Industry best practices and why they matter\n- Real-world examples or case studies\n- Potential challenges I might not see\n- Your recommended next steps',
    category: 'task'
  },
  {
    id: 'creative-ideation',
    name: 'Creative Ideation',
    description: 'Generate innovative ideas and solutions',
    template: 'Context: I\'m trying to [GOAL/CHALLENGE]. Current constraints are [CONSTRAINTS]. The audience/users are [WHO].\n\nRole: Act as a creative strategist who generates innovative yet practical ideas.\n\nInterview: Ask me 2-3 questions about what "success" looks like and what we absolutely cannot change.\n\nTask: Generate 10 diverse ideas that:\n1. Range from safe bets to wild experiments\n2. Address different aspects of the challenge\n3. Include rationale for each idea\n4. Highlight which ideas could combine\n5. Rank by feasibility vs. impact',
    category: 'creative'
  },
  {
    id: 'perspective-shift',
    name: 'Perspective Shift',
    description: 'View challenges through different lenses',
    template: 'Context: I\'m stuck on [CHALLENGE]. I keep approaching it the same way and need fresh perspectives.\n\nRole: Act as a creative provocateur who challenges assumptions and offers radically different viewpoints.\n\nTask: Help me see this challenge through 5 different lenses:\n1. If we had unlimited resources, what would we do?\n2. If we had to solve this in 24 hours with $100, what would we do?\n3. How would [ADMIRED COMPANY/PERSON] approach this?\n4. What would we do if we had to 10x the impact?\n5. What are we assuming that might not be true?\n\nFor each lens, suggest a concrete next action.',
    category: 'creative'
  },
  // Strategic Leadership Prompts
  {
    id: 'future-back',
    name: 'Future-Back Scenario Planning',
    description: 'Think beyond quarterly targets and develop 3-year strategic vision',
    template: 'Context: I lead [team/practice area]. We\'re navigating [specific challenge/opportunity]. Our current approach is [brief description]. The stakes are [what matters most].\n\nRole: Act as my strategic thought partner and scenario planning expert. Help me think future-back and challenge my assumptions.\n\nInterview: Ask me one question at a time, up to 3 questions, to understand what success truly means and what constraints matter most.\n\nTask: After your questions, help me:\n1. Paint a vivid picture of wild success 3 years from now\n2. Work backwards to identify 3-5 pivotal decisions that made it possible\n3. Identify weak signals we should track today\n4. Define capabilities we must build now\n5. Name the biggest risk of our current trajectory',
    category: 'leadership'
  },
  {
    id: 'horizon-scanning',
    name: 'Horizon Scanning',
    description: 'Ensure you\'re not blindsided by market shifts and changes',
    template: 'Context: I\'m responsible for [area/practice]. We\'re currently [brief status]. I need to ensure we\'re not blindsided by changes.\n\nRole: Act as my horizon scanning expert and strategic foresight advisor.\n\nInterview: Ask me one question at a time, up to 3 questions, to understand what specific areas or threats keep me up at night.\n\nTask: Help me identify and prioritise:\n\nNear Horizon (0-12 months): What developments will impact us in the next year? What should we start experimenting with now?\n\nMid Horizon (1-3 years): What shifts could reshape our business model? What conversations should we start having?\n\nFar Horizon (3-5 years): What discontinuous changes could fundamentally alter our industry? What capabilities should we be building?\n\nFor each horizon: What we should DO this quarter, WHO to talk to, and what METRICS would tell us we\'re on track.',
    category: 'leadership'
  },
  {
    id: 'operational-to-strategic',
    name: 'Escape Operational Overwhelm',
    description: 'Shift from tactical firefighting to strategic leadership',
    template: 'Context: I\'m spending most of my time on [list top 3-5 time consumers]. I know I should be focusing on [strategic priorities] but can\'t create the space.\n\nRole: Act as my executive coach and strategic thinking partner. You\'ve helped countless leaders escape operational overwhelm.\n\nInterview: Ask me one question at a time, up to 3 questions, to understand what I\'m actually responsible for versus what I\'ve taken on by default.\n\nTask: Help me:\n1. Distinguish what only I can do (strategic) vs. what others should do (tactical)\n2. Identify 1-3 strategic initiatives that would create 10x more value\n3. Design a plan to delegate, automate, or eliminate 50% of my operational load\n4. Create a "strategic thinking time" practice that sticks\n5. Define success if I successfully shift from operational to strategic\n\nChallenge my assumptions about what "only I can do." Be tough on me.',
    category: 'leadership'
  },
  {
    id: '80-20-focus',
    name: '80/20 Strategic Focus',
    description: 'Apply ruthless prioritisation to your workload',
    template: 'Context: My role is [job title and scope]. Here are all my current priorities: [list everything on your plate].\n\nRole: Act as a ruthless strategic advisor and efficiency expert.\n\nInterview: Ask me one question at a time, up to 3 questions, to understand what I\'m optimising for - growth, profitability, innovation, team development, etc.\n\nTask: Apply 80/20 thinking to identify:\n1. Which 20% of activities will drive 80% of strategic outcomes?\n2. What should I STOP doing immediately?\n3. What should I delegate or automate?\n4. What should I do less of but still maintain?\n5. What should I double-down on with focused intensity?\n\nFor each recommendation, explain WHY strategically this creates leverage.',
    category: 'leadership'
  },
  {
    id: 'strategic-decision',
    name: 'Strategic Decision Framework',
    description: 'Pressure-test significant decisions before committing',
    template: 'Context: I\'m facing a significant decision about [describe decision]. Here\'s what\'s at stake: [impact, constraints, timeline]. Here\'s my current thinking: [if you have one].\n\nRole: Act as my strategic decision advisor and devil\'s advocate. Help me make a faster, smarter decision by challenging assumptions and exposing blind spots.\n\nInterview: Ask me one question at a time, up to 3 questions, to understand what I\'m really optimising for and what I might be missing.\n\nTask: Pressure-test this decision:\n1. Frame: Am I solving the right problem? Alternative framings?\n2. Alternatives: Generate 3-5 genuinely different options\n3. Information: What critical information am I missing? What assumptions need validation?\n4. Values & Trade-offs: What does "success" really look like? What am I willing to sacrifice?\n5. Reasoning: What must be true for this to be right? What would prove me wrong?\n6. Commitment Test: 1-10 confidence? What would increase it to 9+?\n\nBe intellectually honest and challenge weak thinking.',
    category: 'leadership'
  },
  {
    id: 'pre-mortem',
    name: 'Pre-Mortem Analysis',
    description: 'Identify potential failure points before execution begins',
    template: 'Context: I\'m about to make a decision to [describe decision/initiative]. Timeline: [when]. Success would mean [specific outcomes]. Current team/resources: [brief description].\n\nRole: Act as my strategic risk advisor. You\'ve seen hundreds of initiatives fail. Be brutally honest about what could go wrong.\n\nInterview: Ask me one question at a time, up to 3 questions, about what I\'m most worried about or where I have least clarity.\n\nTask: Pre-mortem exercise:\n1. The Failure Memo: It\'s 12 months from now. This failed significantly. Write the memo explaining what went wrong.\n2. Early Warning Signs: What signals did we miss or ignore in months 1-3?\n3. False Assumptions: Which assumptions turned out dangerously wrong?\n4. External Shocks: What external factors did we underestimate?\n5. Mitigation Plan: Design early detection systems, risk mitigation tactics, reversibility mechanisms.\n\nDon\'t hold back. Prevent this failure before it happens.',
    category: 'leadership'
  },
  {
    id: '10x-thinking',
    name: '10x Strategic Thinking',
    description: 'Break through incremental thinking to achieve breakthroughs',
    template: 'Context: Our current approach to [specific challenge/opportunity] is [describe current state]. We\'re trying to improve by [incremental improvements].\n\nRole: Act as a provocative strategic advisor who challenges incremental thinking. Help leaders think 10x, not 10%.\n\nInterview: Ask me one question at a time, up to 3 questions, to understand what constraints I\'m accepting that I shouldn\'t be.\n\nTask: Challenge me to think 10x bigger:\n1. Reframe: If we had to achieve 10x the result with same resources, what completely different approach would we need?\n2. Constraint Breaking: What constraints am I treating as fixed that are actually just assumptions?\n3. Second-Order Effects: What becomes possible if we achieve 10x that\'s impossible with incremental gains?\n4. Adjacent Impossible: What seems impossible now but would become obvious once we solve this?\n5. Forcing Function: What experiment could we run in 30 days to test if 10x thinking is viable?\n\nPush me out of incremental thinking. Create breakthroughs, not improvements.',
    category: 'leadership'
  },
  {
    id: 'ai-native-leadership',
    name: 'AI Native Leadership Development',
    description: 'Develop your own AI capabilities and model the behaviour',
    template: 'Context: My role is [describe role and scope]. Currently, I use AI for [what you do now, if anything]. I want to demonstrate AI Native leadership to my team. Time I can commit: [realistic time per week].\n\nRole: Act as my personal AI leadership coach and strategic development advisor.\n\nInterview: Ask me one question at a time, up to 3 questions, to understand my current mindset about AI, where I feel stuck, and what would constitute visible progress.\n\nTask: Create a 90-day AI Native leadership development plan:\n1. Strategic Use Cases: 3-5 specific ways I can use AI as a Strategic Thought Partner\n2. Weekly Experiments: Design weekly practice using AI for strategic thinking, sharing learning visibly\n3. Visible Learning Journey: Make my AI learning visible without seeming performative\n4. Strategic Conversations: What conversations should I have with my team about AI as thought partner vs. automation?\n5. Success Metrics: Define 3-5 observable behaviours showing progress\n6. Common Pitfalls: What mistakes do leaders make? How do I avoid them?\n\nFocus on strategic leadership, not technical skills.',
    category: 'leadership'
  },
  {
    id: 'psychological-safety',
    name: 'Creating Psychological Safety',
    description: 'Make it safe for your team to experiment and try new things',
    template: 'Context: My team is [describe team]. Currently, when it comes to trying new things/AI/innovation, I observe [describe behaviours - hesitancy, fear of failure, etc.]. Our transformation depends on experimentation.\n\nRole: Act as an organisational psychologist and culture change expert specialising in psychological safety.\n\nInterview: Ask me one question at a time, up to 3 questions, to understand what\'s driving the hesitancy and what I\'m already doing well.\n\nTask: Design approach to make experimentation safe:\n1. Role Modelling: What specific experiments should I visibly try, including sharing failures? Give 3 concrete examples.\n2. Language Patterns: Provide 5 specific phrases to normalise learning from failure.\n3. Recognition Systems: How can I celebrate attempts and learning, not just successes? Design practical mechanisms.\n4. Structural Signals: What team rituals would signal "it\'s safe to experiment here"?\n5. Personal Story: Help me craft a 2-minute story about when I tried something that didn\'t work and why that was valuable.\n6. Failure Resume: Should I create and share one? If yes, help me draft it.\n\nRemember: People do what leaders do, not what leaders say.',
    category: 'leadership'
  },
  {
    id: 'quick-strategic-checkin',
    name: '10-Minute Strategic Check-In',
    description: 'Rapid strategic clarity for busy leaders',
    template: 'Context: [Specific challenge/opportunity in 2-3 sentences]\n\nRole: Act as my strategic advisor for a rapid assessment.\n\nTask: In 10 minutes or less, tell me:\n1. The 3 most important questions I should be asking right now?\n2. The one decision I can make this week that will have the biggest strategic impact?\n3. The one thing I should stop doing immediately to create space for what matters most?\n\nBe direct. No fluff.',
    category: 'leadership'
  },
  {
    id: 'tactical-filter',
    name: 'Strategic vs Tactical Filter',
    description: 'Triage your to-do list into clear categories',
    template: 'Context: Here\'s my to-do list for this week: [list everything]\n\nRole: Act as my ruthless prioritisation coach.\n\nTask: Categorise each item:\n- STRATEGIC (only I can do this, drives growth/transformation)\n- TACTICAL (someone else should do this)\n- ELIMINATE (shouldn\'t be done at all)\n\nFor STRATEGIC items, force-rank them. For TACTICAL items, tell me who should own them. Be brutal about what to eliminate.',
    category: 'leadership'
  },
  {
    id: 'meeting-prep',
    name: 'Meeting Prep Accelerator',
    description: 'Prepare strategically for critical meetings in under 10 minutes',
    template: 'Context: Meeting about [topic] with [stakeholders] in [timeframe]. Current situation: [1-2 sentences].\n\nRole: Act as my meeting strategist.\n\nInterview: Ask me 1 question to clarify the real goal of this meeting.\n\nTask: Help me prepare:\n1. What\'s the ONE key message I need to land?\n2. What 3 questions should I be ready to answer?\n3. What decision or commitment should we walk out with?\n4. What\'s the biggest risk of this meeting being unproductive, and how do I prevent it?\n\nGive me a crisp 3-minute opening that frames the discussion for success.',
    category: 'leadership'
  }
];

export default function PromptBuilder() {
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'learning' | 'meta' | 'task' | 'creative' | 'leadership'>('all');
  const [showPreview, setShowPreview] = useState(false);
  const [activeMode, setActiveMode] = useState<'templates' | 'ai-assistant'>('templates');

  // AI Assistant state
  const [userPrompt, setUserPrompt] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'input' | 'analysis' | 'improved' | 'explanation'>('input');

  const applyTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setPrompt(template.template);
  };

  const filteredTemplates = templates.filter(t =>
    activeCategory === 'all' || t.category === activeCategory
  );

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt);
    alert('Prompt copied to clipboard!');
  };

  const callPromptAssistant = async (action: 'analyze' | 'improve' | 'explain') => {
    setLoading(true);
    try {
      const response = await fetch('/api/prompt-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt, action }),
      });

      const data = await response.json();

      if (response.ok) {
        if (action === 'analyze') {
          setAnalysis(data.result);
          setCurrentStep('analysis');
        } else if (action === 'improve') {
          setImprovedPrompt(data.result);
          setCurrentStep('improved');
        } else if (action === 'explain') {
          setExplanation(data.result);
          setCurrentStep('explanation');
        }
      } else {
        alert('Error: ' + (data.error || 'Failed to process'));
      }
    } catch (error) {
      alert('Failed to connect to AI assistant');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetAssistant = () => {
    setUserPrompt('');
    setAnalysis('');
    setImprovedPrompt('');
    setExplanation('');
    setCurrentStep('input');
  };

  const copyImprovedPrompt = () => {
    navigator.clipboard.writeText(improvedPrompt);
    alert('Improved prompt copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-b-2 border-purple-700">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">📝 PROMPT BUILDER</h1>
              <p className="text-[10px] text-white/80 mt-1 uppercase tracking-wider">Create effective prompts for AI models</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveMode('templates')}
                className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-wider rounded-lg transition-all ${
                  activeMode === 'templates'
                    ? 'bg-white text-purple-600'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                📚 Templates
              </button>
              <button
                onClick={() => setActiveMode('ai-assistant')}
                className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-wider rounded-lg transition-all ${
                  activeMode === 'ai-assistant'
                    ? 'bg-white text-purple-600'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                ✨ AI Assistant
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {activeMode === 'templates' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Template Library */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border-2 border-slate-300 p-4 sticky top-6">
                <h2 className="text-lg font-semibold text-slate-900 uppercase tracking-tight mb-3">Template Library</h2>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(['all', 'learning', 'meta', 'task', 'leadership'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded transition-colors ${
                        activeCategory === cat
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {cat.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Templates */}
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredTemplates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => applyTemplate(template)}
                      className={`w-full text-left p-3 rounded border-2 transition-all ${
                        selectedTemplate?.id === template.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-300 bg-white hover:border-purple-300 hover:bg-purple-50'
                      }`}
                    >
                      <div className="font-semibold text-sm text-slate-900">{template.name}</div>
                      <div className="text-xs text-slate-600 mt-1">{template.description}</div>
                      <div className="mt-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          template.category === 'learning' ? 'bg-blue-100 text-blue-700' :
                          template.category === 'meta' ? 'bg-purple-100 text-purple-700' :
                          template.category === 'task' ? 'bg-green-100 text-green-700' :
                          template.category === 'leadership' ? 'bg-teal-100 text-teal-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {template.category.toUpperCase()}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Prompt Editor */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border-2 border-slate-300 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900 uppercase tracking-tight">Prompt Editor</h2>
                  {selectedTemplate && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-900 text-[10px] font-semibold uppercase tracking-wider rounded-full">
                      {selectedTemplate.name}
                    </span>
                  )}
                </div>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Write your prompt here, or select a template from the library..."
                  className="w-full h-80 p-4 border-2 border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                />

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={copyToClipboard}
                    disabled={!prompt}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-semibold text-[10px] uppercase tracking-wider transition-colors"
                  >
                    📋 COPY
                  </button>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    disabled={!prompt}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-semibold text-[10px] uppercase tracking-wider transition-colors"
                  >
                    👁️ {showPreview ? 'HIDE' : 'SHOW'} PREVIEW
                  </button>
                  <button
                    onClick={() => setPrompt('')}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-semibold text-[10px] uppercase tracking-wider transition-colors"
                  >
                    🗑️ CLEAR
                  </button>
                </div>

                {/* Preview */}
                {showPreview && prompt && (
                  <div className="mt-6 p-4 bg-slate-50 border-2 border-slate-300 rounded-lg">
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Preview</h3>
                    <div className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                      {prompt}
                    </div>
                    <div className="mt-3 text-xs text-slate-500">
                      Character count: {prompt.length}
                    </div>
                  </div>
                )}

                {/* Prompt Tips */}
                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <h3 className="text-sm font-bold text-blue-900 mb-2">💡 Prompt Writing Tips</h3>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Be specific and clear about what you want</li>
                    <li>• Provide context and background information</li>
                    <li>• Use placeholders like [TOPIC] for customizable templates</li>
                    <li>• Specify the desired output format (list, paragraph, code, etc.)</li>
                    <li>• Include examples to guide the AI</li>
                    <li>• Set constraints (word count, tone, audience)</li>
                    <li>• For meta prompts, focus on prompt engineering principles</li>
                  </ul>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                  <h3 className="text-sm font-semibold text-purple-900 uppercase tracking-wider mb-2">🚀 Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => applyTemplate(templates.find(t => t.id === 'meta-prompt')!)}
                      className="px-3 py-2 bg-purple-200 hover:bg-purple-300 text-purple-900 text-[10px] font-semibold uppercase tracking-wider rounded transition-colors"
                    >
                      META PROMPT
                    </button>
                    <button
                      onClick={() => applyTemplate(templates.find(t => t.id === 'eli5')!)}
                      className="px-3 py-2 bg-blue-200 hover:bg-blue-300 text-blue-900 text-[10px] font-semibold uppercase tracking-wider rounded transition-colors"
                    >
                      LEARNING
                    </button>
                    <button
                      onClick={() => applyTemplate(templates.find(t => t.id === 'chain-of-thought')!)}
                      className="px-3 py-2 bg-green-200 hover:bg-green-300 text-green-900 text-[10px] font-semibold uppercase tracking-wider rounded transition-colors"
                    >
                      REASONING
                    </button>
                    <button
                      onClick={() => applyTemplate(templates.find(t => t.id === 'step-by-step')!)}
                      className="px-3 py-2 bg-amber-200 hover:bg-amber-300 text-amber-900 text-[10px] font-semibold uppercase tracking-wider rounded transition-colors"
                    >
                      TASK GUIDE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ) : (
            // AI Assistant Mode
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg border-2 border-slate-300 p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">✨</span>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 uppercase tracking-tight">AI Prompt Assistant</h2>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider mt-1">Transform "Google search" prompts into expert prompts using CRIT</p>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">How it works:</h3>
                  <ol className="text-xs text-blue-800 space-y-1">
                    <li>1. Paste your weak prompt below</li>
                    <li>2. Get AI analysis of what's missing</li>
                    <li>3. Receive an improved CRIT-based prompt</li>
                    <li>4. Learn the pattern to do it yourself</li>
                  </ol>
                </div>

                {/* Input Step */}
                {currentStep === 'input' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
                      Your Current Prompt
                    </label>
                    <textarea
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      placeholder='Example: "Explain machine learning"'
                      className="w-full h-40 p-4 border-2 border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                    />
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => callPromptAssistant('analyze')}
                        disabled={!userPrompt || loading}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-semibold text-[10px] uppercase tracking-wider transition-colors"
                      >
                        {loading ? 'ANALYZING...' : '🔍 ANALYZE MY PROMPT'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Analysis Step */}
                {currentStep === 'analysis' && (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">Your Prompt:</h3>
                      <div className="p-3 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm text-slate-700">
                        {userPrompt}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">📊 Analysis:</h3>
                      <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded text-sm text-slate-700 whitespace-pre-wrap">
                        {analysis}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => callPromptAssistant('improve')}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-semibold text-[10px] uppercase tracking-wider transition-colors"
                      >
                        {loading ? 'IMPROVING...' : '✨ IMPROVE MY PROMPT'}
                      </button>
                      <button
                        onClick={resetAssistant}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-semibold text-[10px] uppercase tracking-wider transition-colors"
                      >
                        🔄 START OVER
                      </button>
                    </div>
                  </div>
                )}

                {/* Improved Prompt Step */}
                {currentStep === 'improved' && (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">Before (Your Prompt):</h3>
                      <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg text-sm text-slate-700">
                        {userPrompt}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">✨ After (Improved Prompt):</h3>
                      <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg text-sm text-slate-700 whitespace-pre-wrap">
                        {improvedPrompt}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={copyImprovedPrompt}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-[10px] uppercase tracking-wider transition-colors"
                      >
                        📋 COPY IMPROVED PROMPT
                      </button>
                      <button
                        onClick={() => callPromptAssistant('explain')}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-semibold text-[10px] uppercase tracking-wider transition-colors"
                      >
                        {loading ? 'GENERATING...' : '📚 EXPLAIN THE CHANGES'}
                      </button>
                      <button
                        onClick={resetAssistant}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-semibold text-[10px] uppercase tracking-wider transition-colors"
                      >
                        🔄 START OVER
                      </button>
                    </div>
                  </div>
                )}

                {/* Explanation Step */}
                {currentStep === 'explanation' && (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">Before:</h3>
                      <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg text-sm text-slate-700">
                        {userPrompt}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">After:</h3>
                      <div className="p-3 bg-green-50 border-2 border-green-300 rounded-lg text-sm text-slate-700 whitespace-pre-wrap">
                        {improvedPrompt}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">📖 What Changed & Why:</h3>
                      <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded text-sm text-slate-700 whitespace-pre-wrap">
                        {explanation}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={copyImprovedPrompt}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-[10px] uppercase tracking-wider transition-colors"
                      >
                        📋 COPY IMPROVED PROMPT
                      </button>
                      <button
                        onClick={resetAssistant}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-semibold text-[10px] uppercase tracking-wider transition-colors"
                      >
                        🔄 TRY ANOTHER PROMPT
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* CRIT Framework Reference */}
              <div className="bg-white rounded-lg border-2 border-slate-300 p-6">
                <h3 className="text-lg font-semibold text-slate-900 uppercase tracking-tight mb-4">📚 CRIT Framework Reference</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                    <h4 className="font-semibold text-purple-900 mb-2">C - Context</h4>
                    <p className="text-xs text-purple-800">Provide rich background about your situation, goals, and constraints. The more strategic context, the better the output.</p>
                  </div>
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <h4 className="font-semibold text-blue-900 mb-2">R - Role</h4>
                    <p className="text-xs text-blue-800">Assign AI a specific expert identity. Simulate any expert at your fingertips.</p>
                  </div>
                  <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                    <h4 className="font-semibold text-green-900 mb-2">I - Interview</h4>
                    <p className="text-xs text-green-800">Let AI ask YOU clarifying questions. This is the secret weapon that transforms results.</p>
                  </div>
                  <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
                    <h4 className="font-semibold text-amber-900 mb-2">T - Task</h4>
                    <p className="text-xs text-amber-800">Define the specific output you need - decision framework, analysis, action plan.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-300 py-3">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-xs text-slate-500">{getFullVersionInfo()}</p>
        </div>
      </footer>
    </div>
  );
}
