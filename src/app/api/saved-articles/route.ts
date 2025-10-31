import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureGuestUser, GUEST_USER_ID } from '@/lib/guest-user';

// GET - Fetch all saved articles for a user
export async function GET(request: NextRequest) {
  try {
    await ensureGuestUser();

    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {
      userId: GUEST_USER_ID,
    };

    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    const articles = await prisma.savedArticle.findMany({
      where,
      orderBy: {
        savedAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      articles,
      count: articles.length,
    });
  } catch (error) {
    console.error('Error fetching saved articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved articles' },
      { status: 500 }
    );
  }
}

// POST - Save a new article
export async function POST(request: NextRequest) {
  try {
    await ensureGuestUser();

    const body = await request.json();
    const { title, link, source, pubDate, description, tags, notes } = body;

    if (!title || !link || !source) {
      return NextResponse.json(
        { error: 'Title, link, and source are required' },
        { status: 400 }
      );
    }

    // Check if already saved
    const existing = await prisma.savedArticle.findFirst({
      where: {
        userId: GUEST_USER_ID,
        link,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Article already saved', article: existing },
        { status: 409 }
      );
    }

    const article = await prisma.savedArticle.create({
      data: {
        userId: GUEST_USER_ID,
        title,
        link,
        source,
        pubDate,
        description: description || null,
        tags: tags || [],
        notes: notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      article,
      message: 'Article saved successfully',
    });
  } catch (error) {
    console.error('Error saving article:', error);
    return NextResponse.json(
      { error: 'Failed to save article' },
      { status: 500 }
    );
  }
}

// PATCH - Update saved article (tags, notes)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, tags, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    const article = await prisma.savedArticle.update({
      where: { id },
      data: {
        ...(tags !== undefined && { tags }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json({
      success: true,
      article,
      message: 'Article updated successfully',
    });
  } catch (error) {
    console.error('Error updating saved article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE - Remove saved article
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, link } = body;

    if (!id && !link) {
      return NextResponse.json(
        { error: 'Article ID or link is required' },
        { status: 400 }
      );
    }

    if (id) {
      await prisma.savedArticle.delete({
        where: { id },
      });
    } else {
      await prisma.savedArticle.deleteMany({
        where: {
          userId: GUEST_USER_ID,
          link,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Article removed successfully',
    });
  } catch (error) {
    console.error('Error deleting saved article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
