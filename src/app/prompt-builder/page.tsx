"use client";

import { useState } from "react";

interface PromptMethodology {
  id: string;
  name: string;
  description: string;
  acronym: string;
  fields: PromptField[];
}

interface PromptField {
  id: string;
  label: string;
  description: string;
  placeholder: string;
  required: boolean;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
}

const METHODOLOGIES: PromptMethodology[] = [
  {
    id: 'clear',
    name: 'CLEAR',
    acronym: 'Context, Limitations, Examples, Audience, Role',
    description: 'A comprehensive framework that ensures your prompt has all necessary elements for accurate AI responses.',
    fields: [
      {
        id: 'context',
        label: 'Context',
        description: 'Provide background information and situational details',
        placeholder: 'Example: We are a healthcare organization preparing for a security audit...',
        required: true,
        type: 'textarea',
      },
      {
        id: 'limitations',
        label: 'Limitations',
        description: 'Define constraints, boundaries, or what NOT to include',
        placeholder: 'Example: Do not include technical jargon, keep under 500 words...',
        required: false,
        type: 'textarea',
      },
      {
        id: 'examples',
        label: 'Examples',
        description: 'Provide sample inputs or desired output style',
        placeholder: 'Example: Similar to the style used in...',
        required: false,
        type: 'textarea',
      },
      {
        id: 'audience',
        label: 'Audience',
        description: 'Who is the target audience for this content?',
        placeholder: 'Example: Non-technical staff, executives, IT team...',
        required: true,
        type: 'text',
      },
      {
        id: 'role',
        label: 'Role',
        description: 'What role or persona should the AI adopt?',
        placeholder: 'Example: Security awareness trainer, CISO, technical writer...',
        required: true,
        type: 'text',
      },
    ],
  },
  {
    id: 'risen',
    name: 'RISEN',
    acronym: 'Role, Instructions, Steps, End goal, Narrowing',
    description: 'A structured approach perfect for complex, multi-step tasks.',
    fields: [
      {
        id: 'role',
        label: 'Role',
        description: "Define the AI's persona or expertise",
        placeholder: 'Example: You are an experienced cybersecurity consultant...',
        required: true,
        type: 'text',
      },
      {
        id: 'instructions',
        label: 'Instructions',
        description: 'Provide clear, specific directives',
        placeholder: 'Example: Create a security awareness email that explains...',
        required: true,
        type: 'textarea',
      },
      {
        id: 'steps',
        label: 'Steps',
        description: 'Break down the task into sequential steps',
        placeholder: 'Example: 1. Introduce the threat 2. Explain the impact 3. Provide actionable advice',
        required: false,
        type: 'textarea',
      },
      {
        id: 'end_goal',
        label: 'End Goal',
        description: 'Describe the desired outcome',
        placeholder: 'Example: An email that employees can understand and act upon',
        required: true,
        type: 'text',
      },
      {
        id: 'narrowing',
        label: 'Narrowing',
        description: 'Specify focus areas or additional constraints',
        placeholder: 'Example: Focus specifically on phishing awareness, avoid overly technical terms',
        required: false,
        type: 'textarea',
      },
    ],
  },
  {
    id: 'coast',
    name: 'COAST',
    acronym: 'Context, Objective, Actions, Scenario, Task',
    description: 'Ideal for scenario-based content creation with clear objectives.',
    fields: [
      {
        id: 'context',
        label: 'Context',
        description: 'Set the situational background',
        placeholder: 'Example: Following a recent ransomware attack in our sector...',
        required: true,
        type: 'textarea',
      },
      {
        id: 'objective',
        label: 'Objective',
        description: 'What you want to achieve',
        placeholder: 'Example: Educate staff about ransomware prevention',
        required: true,
        type: 'text',
      },
      {
        id: 'actions',
        label: 'Actions',
        description: 'Specific actions the AI should take',
        placeholder: 'Example: Draft an email, include statistics, list 5 prevention tips',
        required: true,
        type: 'textarea',
      },
      {
        id: 'scenario',
        label: 'Scenario',
        description: 'Describe the specific use case',
        placeholder: 'Example: Email to all staff after security training session',
        required: false,
        type: 'text',
      },
      {
        id: 'task',
        label: 'Task',
        description: 'The concrete deliverable',
        placeholder: 'Example: A 300-word email with subject line',
        required: true,
        type: 'text',
      },
    ],
  },
  {
    id: 'rtf',
    name: 'RTF (Simple)',
    acronym: 'Role, Task, Format',
    description: 'A streamlined framework for quick, straightforward prompts.',
    fields: [
      {
        id: 'role',
        label: 'Role',
        description: 'Who is the AI?',
        placeholder: 'Example: Security awareness expert',
        required: true,
        type: 'text',
      },
      {
        id: 'task',
        label: 'Task',
        description: 'What needs to be done?',
        placeholder: 'Example: Write a brief explanation of two-factor authentication',
        required: true,
        type: 'textarea',
      },
      {
        id: 'format',
        label: 'Format',
        description: 'How should the output be structured?',
        placeholder: 'Example: 3 bullet points, conversational tone',
        required: true,
        type: 'text',
      },
    ],
  },
];

export default function PromptBuilder() {
  const [selectedMethodology, setSelectedMethodology] = useState<PromptMethodology | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const handleMethodologySelect = (methodology: PromptMethodology) => {
    setSelectedMethodology(methodology);
    setFormData({});
    setGeneratedPrompt('');
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const buildPrompt = () => {
    if (!selectedMethodology) return;

    let prompt = '';

    selectedMethodology.fields.forEach(field => {
      const value = formData[field.id];
      if (value && value.trim()) {
        prompt += `**${field.label}:**\n${value}\n\n`;
      }
    });

    setGeneratedPrompt(prompt.trim());
  };

  const copyToClipboard = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      alert('Prompt copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Prompt Builder</h1>
          <p className="text-gray-600">
            Craft effective AI prompts using proven methodologies
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Methodology Selection */}
          <div className="xl:col-span-4">
            <div className="bg-white p-6 rounded-lg border-2 border-gray-300 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose a Framework</h2>

              <div className="space-y-3">
                {METHODOLOGIES.map((methodology) => (
                  <button
                    key={methodology.id}
                    onClick={() => handleMethodologySelect(methodology)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedMethodology?.id === methodology.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{methodology.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{methodology.acronym}</p>
                    <p className="text-sm text-gray-700">{methodology.description}</p>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900">
                  <strong>💡 Tip:</strong> Start with RTF for simple tasks, use CLEAR or RISEN for complex requirements.
                </p>
              </div>
            </div>
          </div>

          {/* Prompt Builder Form */}
          <div className="xl:col-span-8">
            {!selectedMethodology ? (
              <div className="bg-white p-12 rounded-lg border-2 border-gray-300 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Framework</h3>
                <p className="text-gray-600">
                  Choose a prompt methodology from the left to get started
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Form Fields */}
                <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedMethodology.name} Framework
                    </h2>
                    <span className="text-sm text-gray-600">{selectedMethodology.acronym}</span>
                  </div>

                  <div className="space-y-4">
                    {selectedMethodology.fields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <p className="text-xs text-gray-500 mb-2">{field.description}</p>
                        {field.type === 'textarea' ? (
                          <textarea
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        ) : (
                          <input
                            type="text"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={buildPrompt}
                    className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Build Prompt
                  </button>
                </div>

                {/* Generated Prompt */}
                {generatedPrompt && (
                  <div className="bg-white p-6 rounded-lg border-2 border-green-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-green-900">✓ Your Prompt</h3>
                      <button
                        onClick={copyToClipboard}
                        className="text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Copy to Clipboard
                      </button>
                    </div>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                        {generatedPrompt}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
