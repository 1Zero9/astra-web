import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description?: string;
}

export async function GET() {
  try {
    const allNews: NewsItem[] = [];

    // Fetch active RSS sources from database
    const rssSources = await prisma.rSSSource.findMany({
      where: { isActive: true },
      select: { url: true, name: true },
    });

    if (rssSources.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch all RSS feeds in parallel
    const feedPromises = rssSources.map(async ({ url, name }) => {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'ASTRA-Security-Pulse/1.0',
          },
          next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!response.ok) {
          console.error(`Failed to fetch ${name}: ${response.statusText}`);
          return [];
        }

        const xmlText = await response.text();
        const items = parseRSS(xmlText, name);
        return items;
      } catch (error) {
        console.error(`Error fetching ${name}:`, error);
        return [];
      }
    });

    const results = await Promise.all(feedPromises);
    results.forEach((items) => allNews.push(...items));

    // Sort by date (newest first)
    allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    // Return latest 50 articles
    return NextResponse.json(allNews.slice(0, 50));
  } catch (error) {
    console.error('Error in security-news API:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

// Simple RSS parser (without external dependencies)
function parseRSS(xmlText: string, source: string): NewsItem[] {
  const items: NewsItem[] = [];

  try {
    // Match all <item> tags
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    const matches = xmlText.matchAll(itemRegex);

    for (const match of matches) {
      const itemContent = match[1];

      // Extract title
      const titleMatch = itemContent.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? stripCDATA(titleMatch[1]) : '';

      // Extract link
      const linkMatch = itemContent.match(/<link>(.*?)<\/link>/i);
      const link = linkMatch ? stripCDATA(linkMatch[1]) : '';

      // Extract pubDate
      const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/i);
      const pubDate = pubDateMatch ? stripCDATA(pubDateMatch[1]) : new Date().toISOString();

      // Extract description
      const descMatch = itemContent.match(/<description>(.*?)<\/description>/i);
      let description = descMatch ? stripCDATA(descMatch[1]) : '';

      // Strip HTML tags from description
      description = description.replace(/<[^>]*>/g, '').trim().substring(0, 200);

      if (title && link) {
        items.push({
          title: title.trim(),
          link: link.trim(),
          pubDate,
          source,
          description: description || undefined,
        });
      }
    }
  } catch (error) {
    console.error(`Error parsing RSS for ${source}:`, error);
  }

  return items;
}

function stripCDATA(text: string): string {
  return text.replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim();
}
