import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userPrompt, methodology, previousSteps, mode } = body;

    if (!userPrompt) {
      return NextResponse.json(
        { error: 'User prompt is required' },
        { status: 400 }
      );
    }

    let systemPrompt = '';

    if (mode === 'enhance') {
      // Single-step enhancement
      systemPrompt = buildEnhancementPrompt(userPrompt, methodology);
    } else if (mode === 'learn') {
      // Multi-step learning mode
      systemPrompt = buildLearningPrompt(userPrompt, methodology, previousSteps);
    } else {
      return NextResponse.json(
        { error: 'Invalid mode. Use "enhance" or "learn"' },
        { status: 400 }
      );
    }

    // Use Gemini 2.5 Flash for prompt enhancement
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const enhancedPrompt = response.text();

    return NextResponse.json({
      success: true,
      enhancedPrompt,
      mode,
      step: previousSteps ? previousSteps.length + 1 : 1,
    });
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    return NextResponse.json(
      {
        error: 'Failed to enhance prompt',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function buildEnhancementPrompt(userPrompt: string, methodology?: string): string {
  return `You are an expert prompt engineer. Your task is to enhance and improve the following user prompt to make it more effective for AI language models.

${methodology ? `The user is using the ${methodology} framework. Consider its principles when enhancing.` : ''}

**Original Prompt:**
${userPrompt}

**Your Task:**
1. Analyze the prompt for clarity, specificity, and completeness
2. Identify any ambiguities or missing elements
3. Enhance the prompt by:
   - Adding necessary context
   - Clarifying instructions
   - Specifying desired output format
   - Adding relevant constraints or examples
   - Improving structure and flow

**Output the enhanced prompt ONLY.** Do not include explanations or meta-commentary. Just provide the improved, ready-to-use prompt.`;
}

function buildLearningPrompt(
  currentInput: string,
  methodology: string | undefined,
  previousSteps: Array<{ input: string; enhanced: string }> = []
): string {
  let contextFromPreviousSteps = '';

  if (previousSteps.length > 0) {
    contextFromPreviousSteps = '\n\n**Previous Learning Steps:**\n';
    previousSteps.forEach((step, index) => {
      contextFromPreviousSteps += `\nStep ${index + 1}:\nUser Input: ${step.input}\nRefined Output: ${step.enhanced}\n`;
    });
  }

  return `You are an expert prompt engineer helping a user build a comprehensive "mega prompt" through iterative refinement.

${methodology ? `The user is working with the ${methodology} framework.` : ''}

${contextFromPreviousSteps}

**Current User Input (Step ${previousSteps.length + 1}):**
${currentInput}

**Your Task:**
This is step ${previousSteps.length + 1} of building a comprehensive prompt. The user is adding more details, refinements, or new requirements.

${previousSteps.length > 0
  ? `Build upon and integrate the previous steps. Combine the earlier refined prompts with this new input to create an evolved, more comprehensive version. Maintain all valuable elements from previous steps while incorporating the new requirements.`
  : `Create an initial refined prompt based on this first input. Set a strong foundation that can be built upon in subsequent steps.`
}

**Output Rules:**
- Provide ONLY the refined prompt
- No explanations or meta-commentary
- Integrate all previous learning
- Make it clear, specific, and actionable
- Structure it logically
- Ensure it builds naturally from previous steps`;
}
