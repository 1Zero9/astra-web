import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureGuestUser, GUEST_USER_ID } from '@/lib/guest-user';

// GET - Fetch read states for a user
export async function GET(request: NextRequest) {
  try {
    await ensureGuestUser();

    const { searchParams } = new URL(request.url);
    const articleLinks = searchParams.get('links')?.split(',') || [];

    if (articleLinks.length === 0) {
      // Return all read states
      const readStates = await prisma.articleReadState.findMany({
        where: {
          userId: GUEST_USER_ID,
        },
        orderBy: {
          readAt: 'desc',
        },
      });

      return NextResponse.json({
        success: true,
        readStates,
        count: readStates.length,
      });
    }

    // Return read states for specific articles
    const readStates = await prisma.articleReadState.findMany({
      where: {
        userId: GUEST_USER_ID,
        articleLink: {
          in: articleLinks,
        },
      },
    });

    return NextResponse.json({
      success: true,
      readStates,
      count: readStates.length,
    });
  } catch (error) {
    console.error('Error fetching read states:', error);
    return NextResponse.json(
      { error: 'Failed to fetch read states' },
      { status: 500 }
    );
  }
}

// POST - Mark article as read
export async function POST(request: NextRequest) {
  try {
    await ensureGuestUser();

    const body = await request.json();
    const { articleLink, articleTitle, isRead } = body;

    if (!articleLink || !articleTitle) {
      return NextResponse.json(
        { error: 'Article link and title are required' },
        { status: 400 }
      );
    }

    // Upsert read state
    const readState = await prisma.articleReadState.upsert({
      where: {
        userId_articleLink: {
          userId: GUEST_USER_ID,
          articleLink,
        },
      },
      update: {
        isRead: isRead !== undefined ? isRead : true,
        readAt: new Date(),
        articleTitle,
      },
      create: {
        userId: GUEST_USER_ID,
        articleLink,
        articleTitle,
        isRead: isRead !== undefined ? isRead : true,
      },
    });

    return NextResponse.json({
      success: true,
      readState,
      message: isRead === false ? 'Marked as unread' : 'Marked as read',
    });
  } catch (error) {
    console.error('Error updating read state:', error);
    return NextResponse.json(
      { error: 'Failed to update read state' },
      { status: 500 }
    );
  }
}

// PATCH - Bulk update read states
export async function PATCH(request: NextRequest) {
  try {
    await ensureGuestUser();

    const body = await request.json();
    const { articleLinks, isRead } = body;

    if (!articleLinks || !Array.isArray(articleLinks)) {
      return NextResponse.json(
        { error: 'Article links array is required' },
        { status: 400 }
      );
    }

    // Update all specified articles
    const updates = await Promise.all(
      articleLinks.map((link: string) =>
        prisma.articleReadState.upsert({
          where: {
            userId_articleLink: {
              userId: GUEST_USER_ID,
              articleLink: link,
            },
          },
          update: {
            isRead: isRead !== undefined ? isRead : true,
            readAt: new Date(),
          },
          create: {
            userId: GUEST_USER_ID,
            articleLink: link,
            articleTitle: 'Bulk marked',
            isRead: isRead !== undefined ? isRead : true,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      updated: updates.length,
      message: `${updates.length} articles updated`,
    });
  } catch (error) {
    console.error('Error bulk updating read states:', error);
    return NextResponse.json(
      { error: 'Failed to bulk update read states' },
      { status: 500 }
    );
  }
}

// DELETE - Remove read state
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleLink } = body;

    if (!articleLink) {
      return NextResponse.json(
        { error: 'Article link is required' },
        { status: 400 }
      );
    }

    await prisma.articleReadState.deleteMany({
      where: {
        userId: GUEST_USER_ID,
        articleLink,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Read state removed',
    });
  } catch (error) {
    console.error('Error deleting read state:', error);
    return NextResponse.json(
      { error: 'Failed to delete read state' },
      { status: 500 }
    );
  }
}
