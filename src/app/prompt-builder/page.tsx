"use client";

import { useState } from "react";
import { getFullVersionInfo } from "@/lib/version";

type PromptTemplate = {
  id: string;
  name: string;
  description: string;
  template: string;
  category: 'learning' | 'meta' | 'task' | 'creative';
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
  }
];

export default function PromptBuilder() {
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'learning' | 'meta' | 'task' | 'creative'>('all');
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
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-b border-purple-700">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">📝 Prompt Builder</h1>
              <p className="text-sm text-white/80 mt-1">Create effective prompts for AI models</p>
            </div>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-xs font-bold">
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
                <h2 className="text-lg font-bold text-slate-900 mb-3">Template Library</h2>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(['all', 'learning', 'meta', 'task'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
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
                  <h2 className="text-lg font-bold text-slate-900">Prompt Editor</h2>
                  {selectedTemplate && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
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
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium text-sm transition-colors"
                  >
                    📋 Copy Prompt
                  </button>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    disabled={!prompt}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium text-sm transition-colors"
                  >
                    👁️ {showPreview ? 'Hide' : 'Show'} Preview
                  </button>
                  <button
                    onClick={() => setPrompt('')}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium text-sm transition-colors"
                  >
                    🗑️ Clear
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
                  <h3 className="text-sm font-bold text-purple-900 mb-2">🚀 Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => applyTemplate(templates.find(t => t.id === 'meta-prompt')!)}
                      className="px-3 py-2 bg-purple-200 hover:bg-purple-300 text-purple-900 text-xs font-bold rounded transition-colors"
                    >
                      Create Meta Prompt
                    </button>
                    <button
                      onClick={() => applyTemplate(templates.find(t => t.id === 'eli5')!)}
                      className="px-3 py-2 bg-blue-200 hover:bg-blue-300 text-blue-900 text-xs font-bold rounded transition-colors"
                    >
                      Learning Prompt
                    </button>
                    <button
                      onClick={() => applyTemplate(templates.find(t => t.id === 'chain-of-thought')!)}
                      className="px-3 py-2 bg-green-200 hover:bg-green-300 text-green-900 text-xs font-bold rounded transition-colors"
                    >
                      Reasoning Prompt
                    </button>
                    <button
                      onClick={() => applyTemplate(templates.find(t => t.id === 'step-by-step')!)}
                      className="px-3 py-2 bg-amber-200 hover:bg-amber-300 text-amber-900 text-xs font-bold rounded transition-colors"
                    >
                      Task Guide
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
