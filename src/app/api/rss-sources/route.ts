import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all RSS sources
export async function GET() {
  try {
    const sources = await prisma.rSSSource.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      sources,
      count: sources.length,
    });
  } catch (error) {
    console.error('Error fetching RSS sources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSS sources' },
      { status: 500 }
    );
  }
}

// POST - Create new RSS source
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url, description, isActive } = body;

    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      );
    }

    // Check if URL already exists
    const existing = await prisma.rSSSource.findUnique({
      where: { url },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'RSS source with this URL already exists' },
        { status: 409 }
      );
    }

    const source = await prisma.rSSSource.create({
      data: {
        name,
        url,
        description: description || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      success: true,
      source,
      message: 'RSS source created successfully',
    });
  } catch (error) {
    console.error('Error creating RSS source:', error);
    return NextResponse.json(
      { error: 'Failed to create RSS source' },
      { status: 500 }
    );
  }
}

// PATCH - Update RSS source
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, url, description, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Source ID is required' },
        { status: 400 }
      );
    }

    const source = await prisma.rSSSource.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(url !== undefined && { url }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({
      success: true,
      source,
      message: 'RSS source updated successfully',
    });
  } catch (error) {
    console.error('Error updating RSS source:', error);
    return NextResponse.json(
      { error: 'Failed to update RSS source' },
      { status: 500 }
    );
  }
}

// DELETE - Delete RSS source
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Source ID is required' },
        { status: 400 }
      );
    }

    await prisma.rSSSource.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'RSS source deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting RSS source:', error);
    return NextResponse.json(
      { error: 'Failed to delete RSS source' },
      { status: 500 }
    );
  }
}
