import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureGuestUser, GUEST_USER_ID } from '@/lib/guest-user';

// GET - Fetch reading list
export async function GET(request: NextRequest) {
  try {
    await ensureGuestUser();

    const { searchParams } = new URL(request.url);
    const priority = searchParams.get('priority');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {
      userId: GUEST_USER_ID,
    };

    if (priority && ['high', 'medium', 'low'].includes(priority)) {
      where.priority = priority;
    }

    const items = await prisma.readingListItem.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { addedAt: 'desc' },
      ],
      take: limit,
    });

    return NextResponse.json({
      success: true,
      items,
      count: items.length,
    });
  } catch (error) {
    console.error('Error fetching reading list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reading list' },
      { status: 500 }
    );
  }
}

// POST - Add to reading list
export async function POST(request: NextRequest) {
  try {
    await ensureGuestUser();

    const body = await request.json();
    const { title, link, source, pubDate, description, priority, notes } = body;

    if (!title || !link || !source) {
      return NextResponse.json(
        { error: 'Title, link, and source are required' },
        { status: 400 }
      );
    }

    // Check if already in reading list
    const existing = await prisma.readingListItem.findFirst({
      where: {
        userId: GUEST_USER_ID,
        link,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Article already in reading list', item: existing },
        { status: 409 }
      );
    }

    const item = await prisma.readingListItem.create({
      data: {
        userId: GUEST_USER_ID,
        title,
        link,
        source,
        pubDate,
        description: description || null,
        priority: priority || 'medium',
        notes: notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      item,
      message: 'Added to reading list',
    });
  } catch (error) {
    console.error('Error adding to reading list:', error);
    return NextResponse.json(
      { error: 'Failed to add to reading list' },
      { status: 500 }
    );
  }
}

// PATCH - Update reading list item
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, priority, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const item = await prisma.readingListItem.update({
      where: { id },
      data: {
        ...(priority !== undefined && { priority }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json({
      success: true,
      item,
      message: 'Reading list item updated',
    });
  } catch (error) {
    console.error('Error updating reading list item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

// DELETE - Remove from reading list
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, link } = body;

    if (!id && !link) {
      return NextResponse.json(
        { error: 'Item ID or link is required' },
        { status: 400 }
      );
    }

    if (id) {
      await prisma.readingListItem.delete({
        where: { id },
      });
    } else {
      await prisma.readingListItem.deleteMany({
        where: {
          userId: GUEST_USER_ID,
          link,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Removed from reading list',
    });
  } catch (error) {
    console.error('Error removing from reading list:', error);
    return NextResponse.json(
      { error: 'Failed to remove from reading list' },
      { status: 500 }
    );
  }
}
