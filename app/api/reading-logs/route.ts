import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { validateReadingLogInput } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const genreParam = searchParams.get("genre") || searchParams.get("category");
    const favoriteParam = searchParams.get("isFavorite") || searchParams.get("favorite");
    const searchParam = searchParams.get("search") || searchParams.get("q");

    const where: any = {
      userId: user.id,
    };

    if (genreParam && genreParam.toLowerCase() !== "all") {
      where.genre = { equals: genreParam, mode: "insensitive" };
    }

    if (favoriteParam === "true") {
      where.isFavorite = true;
    }

    if (searchParam && searchParam.trim() !== "") {
      const q = searchParam.trim();
      where.OR = [
        { bookTitle: { contains: q, mode: "insensitive" } },
        { notes: { contains: q, mode: "insensitive" } },
      ];
    }

    const logs = await prisma.readingLog.findMany({
      where,
      orderBy: [{ readAt: "desc" }, { createdAt: "desc" }],
    });

    const formatted = logs.map((l) => ({
      ...l,
      title: l.bookTitle,
      category: l.genre,
      favorite: l.isFavorite,
      note: l.notes,
      date: l.readAt,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/reading-logs error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = validateReadingLogInput(body);

    if (!validation.valid || !validation.parsed) {
      return NextResponse.json(
        { error: validation.error, field: validation.field },
        { status: 400 }
      );
    }

    const { bookTitle, minutes, genre, notes, readAt } = validation.parsed;

    // Duplicate check: Same book title, minutes, and readAt date for same user
    const startOfDay = new Date(readAt);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(readAt);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existing = await prisma.readingLog.findFirst({
      where: {
        userId: user.id,
        bookTitle: { equals: bookTitle, mode: "insensitive" },
        minutes,
        readAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existing) {
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
        : false;

    const log = await prisma.readingLog.create({
      data: {
        userId: user.id,
        bookTitle,
        minutes,
        genre,
        notes,
        isFavorite,
        readAt,
      },
    });

    const formatted = {
      ...log,
      title: log.bookTitle,
      category: log.genre,
      favorite: log.isFavorite,
      note: log.notes,
      date: log.readAt,
    };

    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error("POST /api/reading-logs error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

