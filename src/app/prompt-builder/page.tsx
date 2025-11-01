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
    template: 'Explain [TOPIC] in simple terms that a 5-year-old could understand. Use analogies and avoid jargon.',
    category: 'learning'
  },
  {
    id: 'deep-dive',
    name: 'Deep Dive Analysis',
    description: 'Comprehensive exploration of a topic',
    template: 'Provide a comprehensive analysis of [TOPIC], covering:\n1. Overview and context\n2. Key concepts and principles\n3. Current trends and developments\n4. Practical applications\n5. Future implications',
    category: 'learning'
  },
  {
    id: 'step-by-step',
    name: 'Step-by-Step Guide',
    description: 'Break down complex processes',
    template: 'Create a detailed step-by-step guide for [TASK]. Include:\n- Prerequisites needed\n- Clear numbered steps\n- Expected outcomes\n- Common pitfalls to avoid\n- Tips for success',
    category: 'task'
  },
  {
    id: 'meta-prompt',
    name: 'Meta Prompt Generator',
    description: 'Create prompts that generate better prompts',
    template: 'You are a prompt engineering expert. Create an optimized prompt for: [GOAL]\n\nThe prompt should:\n1. Be clear and specific\n2. Provide context and constraints\n3. Define the desired output format\n4. Include examples if helpful\n5. Specify the tone and style',
    category: 'meta'
  },
  {
    id: 'chain-of-thought',
    name: 'Chain of Thought',
    description: 'Encourage step-by-step reasoning',
    template: 'Solve [PROBLEM] using chain-of-thought reasoning. Show your work step by step:\n1. First, analyze what we know\n2. Then, identify what we need to find\n3. Next, apply relevant concepts\n4. Finally, verify the solution',
    category: 'task'
  },
  {
    id: 'role-based',
    name: 'Role-Based Prompt',
    description: 'Get expert perspective on topics',
    template: 'You are a [ROLE/EXPERT]. Provide your expert perspective on [TOPIC]. Consider:\n- Your specialized knowledge in this field\n- Industry best practices\n- Real-world applications\n- Potential challenges and solutions',
    category: 'task'
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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-b-2 border-purple-700">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">📝 PROMPT BUILDER</h1>
              <p className="text-[10px] text-white/80 mt-1 uppercase tracking-wider">Create effective prompts for AI models</p>
            </div>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-full text-[10px] font-semibold uppercase tracking-wider">
              PRACTICAL TOOLS
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-6">
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
