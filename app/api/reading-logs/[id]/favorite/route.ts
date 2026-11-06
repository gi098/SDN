import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.readingLog.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json(
        { error: "Reading session not found" },
        { status: 404 }
      );
    }

    let nextFav = !existing.isFavorite;
    try {
      const body = await request.json();
      if (body.isFavorite !== undefined) nextFav = Boolean(body.isFavorite);
      else if (body.favorite !== undefined) nextFav = Boolean(body.favorite);
    } catch {
      // Empty body implies toggle
    }

    const updated = await prisma.readingLog.update({
      where: { id },
      data: { isFavorite: nextFav },
    });

    return NextResponse.json({
      ...updated,
      title: updated.bookTitle,
      category: updated.genre,
      favorite: updated.isFavorite,
      note: updated.notes,
      date: updated.readAt,
    });
  } catch (error) {
    console.error("PATCH /api/reading-logs/[id]/favorite error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return PATCH(request, context);
}
