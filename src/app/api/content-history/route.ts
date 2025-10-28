import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GUEST_USER_ID } from '@/lib/guest-user';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const contentType = searchParams.get('contentType');

    // Build filter
    const where: any = {
      userId: GUEST_USER_ID,
    };

    if (contentType) {
      where.contentType = contentType;
    }

    // Fetch content history
    const history = await prisma.generatedContent.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: {
        id: true,
        contentType: true,
        title: true,
        content: true,
        focusArea: true,
        tone: true,
        sourceLinks: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      history,
      count: history.length,
    });
  } catch (error) {
    console.error('Error fetching content history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content history' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Content ID required' },
        { status: 400 }
      );
    }

    await prisma.generatedContent.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Content deleted',
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
