import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureGuestUser, GUEST_USER_ID } from '@/lib/guest-user';

// GET - Fetch analytics data
export async function GET(request: NextRequest) {
  try {
    await ensureGuestUser();

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const type = searchParams.get('type') || 'overview';

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    switch (type) {
      case 'overview':
        return await getOverviewAnalytics(startDate);
      case 'reading-patterns':
        return await getReadingPatterns(startDate);
      case 'trending':
        return await getTrendingAnalytics(startDate);
      case 'sources':
        return await getSourceAnalytics(startDate);
      default:
        return await getOverviewAnalytics(startDate);
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

async function getOverviewAnalytics(startDate: Date) {
  // Get read articles count
  const readArticles = await prisma.articleReadState.count({
    where: {
      userId: GUEST_USER_ID,
      readAt: {
        gte: startDate,
      },
    },
  });

  // Get saved articles count
  const savedArticles = await prisma.savedArticle.count({
    where: {
      userId: GUEST_USER_ID,
      savedAt: {
        gte: startDate,
      },
    },
  });

  // Get reading list count
  const readingListCount = await prisma.readingListItem.count({
    where: {
      userId: GUEST_USER_ID,
    },
  });

  // Get generated content count
  const generatedContent = await prisma.generatedContent.count({
    where: {
      userId: GUEST_USER_ID,
      createdAt: {
        gte: startDate,
      },
    },
  });

  // Get AI summaries generated
  const summaries = await prisma.articleSummary.count({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
  });

  // Get recent read articles for sources/topics
  const recentReads = await prisma.articleReadState.findMany({
    where: {
      userId: GUEST_USER_ID,
      readAt: {
        gte: startDate,
      },
    },
    select: {
      articleTitle: true,
      readAt: true,
    },
    orderBy: {
      readAt: 'desc',
    },
    take: 100,
  });

  // Extract topics from titles
  const topicCounts: Record<string, number> = {};
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are']);

  recentReads.forEach((item) => {
    const words = item.articleTitle.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 4 && !stopWords.has(word));

    words.forEach(word => {
      topicCounts[word] = (topicCounts[word] || 0) + 1;
    });
  });

  const topTopics = Object.entries(topicCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([topic, count]) => ({ topic, count }));

  return NextResponse.json({
    success: true,
    analytics: {
      period: `${Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days`,
      readArticles,
      savedArticles,
      readingListCount,
      generatedContent,
      aiSummariesGenerated: summaries,
      topTopics,
    },
  });
}

async function getReadingPatterns(startDate: Date) {
  const readStates = await prisma.articleReadState.findMany({
    where: {
      userId: GUEST_USER_ID,
      readAt: {
        gte: startDate,
      },
    },
    select: {
      readAt: true,
      articleTitle: true,
    },
    orderBy: {
      readAt: 'asc',
    },
  });

  // Group by date
  const dailyCounts: Record<string, number> = {};
  const hourCounts: Record<number, number> = {};

  readStates.forEach((state) => {
    const date = new Date(state.readAt);
    const dateKey = date.toISOString().split('T')[0];
    const hour = date.getHours();

    dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  const dailyActivity = Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    count,
  }));

  const hourlyActivity = Object.entries(hourCounts).map(([hour, count]) => ({
    hour: parseInt(hour),
    count,
  })).sort((a, b) => a.hour - b.hour);

  return NextResponse.json({
    success: true,
    patterns: {
      totalReads: readStates.length,
      dailyActivity,
      hourlyActivity,
      avgPerDay: (readStates.length / Object.keys(dailyCounts).length).toFixed(1),
    },
  });
}

async function getTrendingAnalytics(startDate: Date) {
  const readStates = await prisma.articleReadState.findMany({
    where: {
      userId: GUEST_USER_ID,
      readAt: {
        gte: startDate,
      },
    },
    select: {
      articleTitle: true,
    },
  });

  // Extract keywords and count frequency
  const keywordCounts: Record<string, number> = {};
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'been', 'have', 'has']);

  readStates.forEach((state) => {
    const words = state.articleTitle.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 4 && !stopWords.has(word));

    words.forEach(word => {
      keywordCounts[word] = (keywordCounts[word] || 0) + 1;
    });
  });

  const trending = Object.entries(keywordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([keyword, count]) => ({ keyword, count }));

  return NextResponse.json({
    success: true,
    trending,
  });
}

async function getSourceAnalytics(startDate: Date) {
  const savedArticles = await prisma.savedArticle.findMany({
    where: {
      userId: GUEST_USER_ID,
      savedAt: {
        gte: startDate,
      },
    },
    select: {
      source: true,
    },
  });

  const sourceCounts: Record<string, number> = {};
  savedArticles.forEach((article) => {
    sourceCounts[article.source] = (sourceCounts[article.source] || 0) + 1;
  });

  const sources = Object.entries(sourceCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([source, count]) => ({ source, count }));

  return NextResponse.json({
    success: true,
    sources,
  });
}

// POST - Track analytics event
export async function POST(request: NextRequest) {
  try {
    await ensureGuestUser();

    const body = await request.json();
    const { articlesRead, topSources, topTopics, topSeverity, timeSpent } = body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upsert daily analytics
    const analytics = await prisma.readingAnalytics.upsert({
      where: {
        userId_date: {
          userId: GUEST_USER_ID,
          date: today,
        },
      },
      update: {
        articlesRead: articlesRead || 0,
        topSources: topSources || [],
        topTopics: topTopics || [],
        topSeverity: topSeverity || null,
        timeSpent: timeSpent || 0,
      },
      create: {
        userId: GUEST_USER_ID,
        date: today,
        articlesRead: articlesRead || 0,
        topSources: topSources || [],
        topTopics: topTopics || [],
        topSeverity: topSeverity || null,
        timeSpent: timeSpent || 0,
      },
    });

    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
}
