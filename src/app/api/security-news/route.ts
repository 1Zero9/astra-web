import { NextResponse } from 'next/server';

const RSS_FEEDS = [
  { url: 'https://www.bleepingcomputer.com/feed/', source: 'Bleeping Computer' },
  { url: 'https://feeds.feedburner.com/TheHackersNews', source: 'The Hacker News' },
  { url: 'https://krebsonsecurity.com/feed/', source: 'Krebs on Security' },
];

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

    const feedPromises = RSS_FEEDS.map(async ({ url, source }) => {
      try {
        const response = await fetch(url, {
          headers: { 'User-Agent': 'ASTRA/1.0' },
          next: { revalidate: 300 },
        });

        if (!response.ok) return [];

        const xmlText = await response.text();
        return parseRSS(xmlText, source);
      } catch (error) {
        console.error(`Error fetching ${source}:`, error);
        return [];
      }
    });

    const results = await Promise.all(feedPromises);
    results.forEach((items) => allNews.push(...items));

    allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    return NextResponse.json(allNews.slice(0, 50));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

function parseRSS(xmlText: string, source: string): NewsItem[] {
  const items: NewsItem[] = [];

  try {
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    const matches = xmlText.matchAll(itemRegex);

    for (const match of matches) {
      const itemContent = match[1];

      const titleMatch = itemContent.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? stripCDATA(titleMatch[1]) : '';

      const linkMatch = itemContent.match(/<link>(.*?)<\/link>/i);
      const link = linkMatch ? stripCDATA(linkMatch[1]) : '';

      const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/i);
      const pubDate = pubDateMatch ? stripCDATA(pubDateMatch[1]) : new Date().toISOString();

      const descMatch = itemContent.match(/<description>(.*?)<\/description>/i);
      let description = descMatch ? stripCDATA(descMatch[1]) : '';
      description = description.replace(/<[^>]*>/g, '').trim().substring(0, 200);

      if (title && link) {
        items.push({ title: title.trim(), link: link.trim(), pubDate, source, description: description || undefined });
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
