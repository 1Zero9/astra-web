import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// GET - Fetch cached summary
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleLink = searchParams.get('link');

    if (!articleLink) {
      return NextResponse.json(
        { error: 'Article link is required' },
        { status: 400 }
      );
    }

    const summary = await prisma.articleSummary.findUnique({
      where: { articleLink },
    });

    if (!summary) {
      return NextResponse.json(
        { error: 'Summary not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch summary' },
      { status: 500 }
    );
  }
}

// POST - Generate AI summary
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleLink, title, description, source, type } = body;

    if (!articleLink || !title) {
      return NextResponse.json(
        { error: 'Article link and title are required' },
        { status: 400 }
      );
    }

    // Check if summary already exists
    const existing = await prisma.articleSummary.findUnique({
      where: { articleLink },
    });

    // If requesting specific type and it exists, return it
    if (existing && type) {
      const fieldMap: Record<string, string> = {
        summary: existing.summary,
        eli5: existing.eli5 || '',
        impact: existing.impact || '',
        actions: existing.actions || '',
      };

      if (fieldMap[type]) {
        return NextResponse.json({
          success: true,
          summary: existing,
          cached: true,
        });
      }
    }

    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

    let prompt = '';
    let fieldToUpdate = '';

    switch (type) {
      case 'eli5':
        prompt = `Explain this cybersecurity news article in simple terms that anyone can understand (Explain Like I'm 5):

Title: ${title}
Source: ${source}
${description ? `Description: ${description}` : ''}

Provide a 2-3 sentence explanation that:
- Uses simple, everyday language
- Avoids technical jargon
- Explains why this matters to regular people
- Is engaging and easy to understand`;
        fieldToUpdate = 'eli5';
        break;

      case 'impact':
        prompt = `Analyze the business impact of this cybersecurity news:

Title: ${title}
Source: ${source}
${description ? `Description: ${description}` : ''}

Provide a concise business impact analysis (2-3 paragraphs) covering:
- Who is affected (industries, organizations, individuals)
- What the potential consequences are
- Financial, operational, and reputational risks
- Urgency level`;
        fieldToUpdate = 'impact';
        break;

      case 'actions':
        prompt = `Based on this cybersecurity news, provide specific recommended actions:

Title: ${title}
Source: ${source}
${description ? `Description: ${description}` : ''}

Provide 3-5 actionable recommendations:
- What organizations should do immediately
- What individuals should do to protect themselves
- What to monitor or watch for
- Any tools, patches, or resources mentioned
Format as a bulleted list with clear, specific actions.`;
        fieldToUpdate = 'actions';
        break;

      default:
        // Generate standard summary
        prompt = `Summarize this cybersecurity news article concisely:

Title: ${title}
Source: ${source}
${description ? `Description: ${description}` : ''}

Provide a 2-3 sentence summary that:
- Captures the key threat or development
- Explains the significance
- Mentions any specific vulnerabilities, vendors, or CVEs
- Is clear and professional`;
        fieldToUpdate = 'summary';
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text().trim();

    // Extract CVEs if present
    const cveMatches = title.match(/CVE-\d{4}-\d{4,}/gi) || [];
    const descCveMatches = description?.match(/CVE-\d{4}-\d{4,}/gi) || [];
    const allCves = Array.from(new Set([...cveMatches, ...descCveMatches]));

    // Upsert the summary
    const summary = await prisma.articleSummary.upsert({
      where: { articleLink },
      update: {
        [fieldToUpdate]: generatedText,
        ...(allCves.length > 0 && { cves: allCves }),
      },
      create: {
        articleLink,
        title,
        summary: fieldToUpdate === 'summary' ? generatedText : 'Summary pending',
        eli5: fieldToUpdate === 'eli5' ? generatedText : null,
        impact: fieldToUpdate === 'impact' ? generatedText : null,
        actions: fieldToUpdate === 'actions' ? generatedText : null,
        cves: allCves,
        iocs: [],
      },
    });

    return NextResponse.json({
      success: true,
      summary,
      generated: fieldToUpdate,
      cached: false,
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
