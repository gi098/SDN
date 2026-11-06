import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { validateReadingLogInput } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const log = await prisma.readingLog.findUnique({
      where: { id },
    });

    if (!log || log.userId !== user.id) {
      return NextResponse.json(
        { error: "Reading session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...log,
      title: log.bookTitle,
      category: log.genre,
      favorite: log.isFavorite,
      note: log.notes,
      date: log.readAt,
    });
  } catch (error) {
    console.error("GET /api/reading-logs/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const body = await request.json();

    // If body contains only isFavorite/favorite toggle
    if (
      (body.isFavorite !== undefined || body.favorite !== undefined) &&
      body.bookTitle === undefined &&
      body.title === undefined &&
      body.minutes === undefined
    ) {
      const nextFav =
        body.isFavorite !== undefined ? Boolean(body.isFavorite) : Boolean(body.favorite);

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
    }

    const validation = validateReadingLogInput(body);
    if (!validation.valid || !validation.parsed) {
      return NextResponse.json(
        { error: validation.error, field: validation.field },
        { status: 400 }
      );
    }

    const { bookTitle, minutes, genre, notes, readAt } = validation.parsed;

    // Check duplicate excluding self
    const startOfDay = new Date(readAt);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(readAt);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const dup = await prisma.readingLog.findFirst({
      where: {
        userId: user.id,
        id: { not: id },
        bookTitle: { equals: bookTitle, mode: "insensitive" },
        minutes,
        readAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (dup) {
      return NextResponse.json(
        {
          error:
            "A reading session with the same title, minutes, and date already exists",
        },
        { status: 409 }
      );
    }

    const isFavorite =
      typeof body.isFavorite === "boolean"
        ? body.isFavorite
        : typeof body.favorite === "boolean"
        ? body.favorite
        : existing.isFavorite;

    const updated = await prisma.readingLog.update({
      where: { id },
      data: {
        bookTitle,
        minutes,
        genre,
        notes,
        isFavorite,
        readAt,
      },
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
    console.error("PUT /api/reading-logs/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await prisma.readingLog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Reading session deleted" });
  } catch (error) {
    console.error("DELETE /api/reading-logs/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
