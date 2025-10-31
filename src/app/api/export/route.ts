import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureGuestUser, GUEST_USER_ID } from '@/lib/guest-user';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description?: string;
}

// POST - Export articles in various formats
export async function POST(request: NextRequest) {
  try {
    await ensureGuestUser();

    const body = await request.json();
    const { articles, format, includeType } = body;

    if (!articles || !Array.isArray(articles)) {
      return NextResponse.json(
        { error: 'Articles array is required' },
        { status: 400 }
      );
    }

    const exportFormat = format || 'markdown';
    let content = '';
    let mimeType = 'text/plain';
    let filename = `astra-export-${new Date().toISOString().split('T')[0]}`;

    switch (exportFormat) {
      case 'csv':
        content = exportToCSV(articles);
        mimeType = 'text/csv';
        filename += '.csv';
        break;

      case 'markdown':
        content = exportToMarkdown(articles, includeType);
        mimeType = 'text/markdown';
        filename += '.md';
        break;

      case 'json':
        content = JSON.stringify(articles, null, 2);
        mimeType = 'application/json';
        filename += '.json';
        break;

      case 'html':
        content = exportToHTML(articles, includeType);
        mimeType = 'text/html';
        filename += '.html';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid format. Supported: csv, markdown, json, html' },
          { status: 400 }
        );
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting articles:', error);
    return NextResponse.json(
      { error: 'Failed to export articles' },
      { status: 500 }
    );
  }
}

// GET - Export saved articles
export async function GET(request: NextRequest) {
  try {
    await ensureGuestUser();

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'markdown';
    const type = searchParams.get('type') || 'saved'; // 'saved' or 'reading-list'

    let articles: any[] = [];

    if (type === 'saved') {
      const saved = await prisma.savedArticle.findMany({
        where: {
          userId: GUEST_USER_ID,
        },
        orderBy: {
          savedAt: 'desc',
        },
      });

      articles = saved.map(item => ({
        title: item.title,
        link: item.link,
        source: item.source,
        pubDate: item.pubDate,
        description: item.description,
        tags: item.tags,
        notes: item.notes,
        savedAt: item.savedAt.toISOString(),
      }));
    } else if (type === 'reading-list') {
      const readingList = await prisma.readingListItem.findMany({
        where: {
          userId: GUEST_USER_ID,
        },
        orderBy: [
          { priority: 'desc' },
          { addedAt: 'desc' },
        ],
      });

      articles = readingList.map(item => ({
        title: item.title,
        link: item.link,
        source: item.source,
        pubDate: item.pubDate,
        description: item.description,
        priority: item.priority,
        notes: item.notes,
        addedAt: item.addedAt.toISOString(),
      }));
    }

    let content = '';
    let mimeType = 'text/plain';
    let filename = `astra-${type}-${new Date().toISOString().split('T')[0]}`;

    switch (format) {
      case 'csv':
        content = exportToCSV(articles);
        mimeType = 'text/csv';
        filename += '.csv';
        break;

      case 'markdown':
        content = exportToMarkdown(articles, type);
        mimeType = 'text/markdown';
        filename += '.md';
        break;

      case 'json':
        content = JSON.stringify(articles, null, 2);
        mimeType = 'application/json';
        filename += '.json';
        break;

      case 'html':
        content = exportToHTML(articles, type);
        mimeType = 'text/html';
        filename += '.html';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid format' },
          { status: 400 }
        );
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting:', error);
    return NextResponse.json(
      { error: 'Failed to export' },
      { status: 500 }
    );
  }
}

function exportToCSV(articles: any[]): string {
  const headers = ['Title', 'Link', 'Source', 'Date', 'Description'];
  const rows = articles.map(article => [
    escapeCSV(article.title),
    escapeCSV(article.link),
    escapeCSV(article.source),
    escapeCSV(article.pubDate || article.savedAt || article.addedAt || ''),
    escapeCSV(article.description || ''),
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
}

function escapeCSV(value: string): string {
  if (!value) return '""';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return `"${stringValue}"`;
}

function exportToMarkdown(articles: any[], type: string): string {
  const title = type === 'saved' ? 'Saved Articles' : type === 'reading-list' ? 'Reading List' : 'Security News Articles';
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  let markdown = `# ${title}\n\n`;
  markdown += `*Exported from ASTRA on ${date}*\n\n`;
  markdown += `Total: ${articles.length} articles\n\n`;
  markdown += `---\n\n`;

  articles.forEach((article, index) => {
    markdown += `## ${index + 1}. ${article.title}\n\n`;
    markdown += `**Source:** ${article.source}  \n`;
    markdown += `**Link:** [${article.link}](${article.link})  \n`;
    markdown += `**Date:** ${new Date(article.pubDate || article.savedAt || article.addedAt).toLocaleDateString()}  \n`;

    if (article.priority) {
      markdown += `**Priority:** ${article.priority}  \n`;
    }

    if (article.tags && article.tags.length > 0) {
      markdown += `**Tags:** ${article.tags.join(', ')}  \n`;
    }

    if (article.description) {
      markdown += `\n${article.description}\n`;
    }

    if (article.notes) {
      markdown += `\n**Notes:** ${article.notes}\n`;
    }

    markdown += `\n---\n\n`;
  });

  return markdown;
}

function exportToHTML(articles: any[], type: string): string {
  const title = type === 'saved' ? 'Saved Articles' : type === 'reading-list' ? 'Reading List' : 'Security News Articles';
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ASTRA Export</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.6;
      color: #333;
    }
    h1 { color: #1a1a1a; border-bottom: 3px solid #2563eb; padding-bottom: 0.5rem; }
    h2 { color: #2563eb; margin-top: 2rem; }
    .meta { color: #666; font-size: 0.9rem; margin: 0.5rem 0; }
    .description { background: #f3f4f6; padding: 1rem; border-left: 4px solid #2563eb; margin: 1rem 0; }
    .notes { background: #fef3c7; padding: 1rem; border-left: 4px solid #f59e0b; margin: 1rem 0; }
    .tags { display: inline-flex; gap: 0.5rem; flex-wrap: wrap; margin: 0.5rem 0; }
    .tag { background: #dbeafe; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 2rem 0; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p class="meta">Exported from ASTRA on ${date} | Total: ${articles.length} articles</p>
  <hr>
`;

  articles.forEach((article, index) => {
    html += `
  <article>
    <h2>${index + 1}. ${escapeHTML(article.title)}</h2>
    <p class="meta">
      <strong>Source:</strong> ${escapeHTML(article.source)} |
      <strong>Date:</strong> ${new Date(article.pubDate || article.savedAt || article.addedAt).toLocaleDateString()}
      ${article.priority ? `| <strong>Priority:</strong> ${article.priority}` : ''}
    </p>
    <p><a href="${escapeHTML(article.link)}" target="_blank">${escapeHTML(article.link)}</a></p>
`;

    if (article.tags && article.tags.length > 0) {
      html += `    <div class="tags">\n`;
      article.tags.forEach((tag: string) => {
        html += `      <span class="tag">${escapeHTML(tag)}</span>\n`;
      });
      html += `    </div>\n`;
    }

    if (article.description) {
      html += `    <div class="description">${escapeHTML(article.description)}</div>\n`;
    }

    if (article.notes) {
      html += `    <div class="notes"><strong>Notes:</strong> ${escapeHTML(article.notes)}</div>\n`;
    }

    html += `  </article>\n  <hr>\n`;
  });

  html += `
</body>
</html>`;

  return html;
}

function escapeHTML(text: string): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
