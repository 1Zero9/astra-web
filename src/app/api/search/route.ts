import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureGuestUser, GUEST_USER_ID } from '@/lib/guest-user';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// GET - Search across saved articles and reading list
export async function GET(request: NextRequest) {
  try {
    await ensureGuestUser();

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all'; // 'all', 'saved', 'reading-list'
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const results: any = {
      savedArticles: [],
      readingList: [],
    };

    // Search saved articles
    if (type === 'all' || type === 'saved') {
      const saved = await prisma.savedArticle.findMany({
        where: {
          userId: GUEST_USER_ID,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { source: { contains: query, mode: 'insensitive' } },
            { notes: { contains: query, mode: 'insensitive' } },
            { tags: { has: query.toLowerCase() } },
          ],
        },
        orderBy: {
          savedAt: 'desc',
        },
        take: limit,
      });

      results.savedArticles = saved;
    }

    // Search reading list
    if (type === 'all' || type === 'reading-list') {
      const readingList = await prisma.readingListItem.findMany({
        where: {
          userId: GUEST_USER_ID,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { source: { contains: query, mode: 'insensitive' } },
            { notes: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: [
          { priority: 'desc' },
          { addedAt: 'desc' },
        ],
        take: limit,
      });

      results.readingList = readingList;
    }

    const totalResults = results.savedArticles.length + results.readingList.length;

    return NextResponse.json({
      success: true,
      query,
      results,
      totalResults,
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
}
