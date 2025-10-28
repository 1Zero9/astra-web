import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentType, articles, focusArea, tone } = body;

    if (!articles || articles.length === 0) {
      return NextResponse.json(
        { error: 'No articles provided' },
        { status: 400 }
      );
    }

    // Prepare the prompt based on content type
    const prompt = buildPrompt(contentType, articles, focusArea, tone);

    // Use Gemini Pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    return NextResponse.json({
      success: true,
      content: generatedText,
      contentType,
      articleCount: articles.length,
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function buildPrompt(
  contentType: string,
  articles: any[],
  focusArea?: string,
  tone?: string
): string {
  // Extract article information
  const articleSummaries = articles
    .map((article, index) => {
      return `${index + 1}. **${article.title}**
   Source: ${article.source}
   Link: ${article.link}
   ${article.description ? `Description: ${article.description}` : ''}`;
    })
    .join('\n\n');

  const focusText = focusArea ? `\n\nFocus Area: ${focusArea}` : '';
  const toneText = tone || 'Professional';

  let promptTemplate = '';

  switch (contentType) {
    case 'Security Awareness Email':
      promptTemplate = `You are a cybersecurity communications expert. Based on the following recent security news articles, create a security awareness email for employees.

The email should:
- Start with a clear, engaging subject line
- Summarize the key security threats or developments
- Explain why this matters to employees
- Provide 2-3 actionable takeaways or best practices
- Use a ${toneText.toLowerCase()} tone
- Be concise (300-400 words)
${focusText}

Articles:
${articleSummaries}

Generate a complete email that can be sent to staff:`;
      break;

    case 'Executive Summary':
      promptTemplate = `You are a cybersecurity analyst preparing a brief for executives. Based on these recent security developments, create an executive summary.

The summary should:
- Start with a clear headline
- Provide high-level overview of key threats/developments
- Focus on business impact and risk
- Be written in ${toneText.toLowerCase()} language
- Include 2-3 strategic recommendations
- Be very concise (200-250 words)
${focusText}

Articles:
${articleSummaries}

Generate an executive summary:`;
      break;

    case 'Team Briefing':
      promptTemplate = `You are preparing a security team briefing. Based on these recent security news articles, create a technical briefing for the security/IT team.

The briefing should:
- Summarize key technical details and threats
- Highlight specific vulnerabilities or attack vectors
- Provide technical recommendations or mitigation steps
- Use ${toneText.toLowerCase()} language appropriate for technical staff
- Be structured and clear (300-400 words)
${focusText}

Articles:
${articleSummaries}

Generate a team briefing:`;
      break;

    case 'Viva Engage Post':
      promptTemplate = `You are creating an engaging social post for Microsoft Viva Engage (Yammer) about cybersecurity. Based on these recent news articles, create a post that will catch attention and educate employees.

The post should:
- Start with an attention-grabbing opening line or question
- Summarize the key point in a conversational way
- Include 1-2 actionable tips
- Be engaging and use a ${toneText.toLowerCase()} but approachable tone
- Be short and scannable (150-200 words max)
- Use emojis sparingly and appropriately
${focusText}

Articles:
${articleSummaries}

Generate a Viva Engage post:`;
      break;

    case 'Slide Bullets':
      promptTemplate = `You are preparing bullet points for a security awareness presentation. Based on these recent articles, create clear, concise bullet points suitable for PowerPoint slides.

The bullets should:
- Be organized into 2-3 main sections
- Each bullet should be short and impactful
- Focus on key facts and actions
- Use a ${toneText.toLowerCase()} tone
- Be presentation-ready
${focusText}

Articles:
${articleSummaries}

Generate slide bullets in this format:
**[Section Title]**
• Bullet point 1
• Bullet point 2
• Bullet point 3`;
      break;

    default:
      promptTemplate = `Based on the following security news articles, create ${contentType} content. Use a ${toneText.toLowerCase()} tone.${focusText}

Articles:
${articleSummaries}

Generate the content:`;
  }

  return promptTemplate;
}
