import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ALLOWED_GENRES } from "@/lib/types";

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

    const logs = await prisma.readingLog.findMany({ where });

    const totalSessions = logs.length;
    const totalMinutes = logs.reduce((sum, l) => sum + (l.minutes || 0), 0);
    const favoriteCount = logs.filter((l) => l.isFavorite).length;

    // Aggregate by genre
    const genreMap: Record<string, { count: number; totalMinutes: number }> = {};
    for (const g of ALLOWED_GENRES) {
      genreMap[g] = { count: 0, totalMinutes: 0 };
    }

    for (const l of logs) {
      const g = l.genre || "Other";
      if (!genreMap[g]) {
        genreMap[g] = { count: 0, totalMinutes: 0 };
      }
      genreMap[g].count += 1;
      genreMap[g].totalMinutes += l.minutes || 0;
    }

    const genreBreakdown = Object.entries(genreMap)
      .map(([genre, data]) => ({
        genre,
        category: genre,
        count: data.count,
        totalMinutes: data.totalMinutes,
        total: data.totalMinutes,
        percentage:
          totalMinutes > 0
            ? Math.round((data.totalMinutes / totalMinutes) * 100)
            : 0,
      }))
      .sort((a, b) => {
        // Sort descending by totalMinutes, tie-breaker by count
        if (b.totalMinutes !== a.totalMinutes) {
          return b.totalMinutes - a.totalMinutes;
        }
        return b.count - a.count;
      });

    return NextResponse.json({
      totalSessions,
      totalLogs: totalSessions,
      count: totalSessions,
      totalMinutes,
      totalAmount: totalMinutes,
      favoriteCount,
      starredCount: favoriteCount,
      genreBreakdown,
      categoryBreakdown: genreBreakdown,
      breakdown: genreBreakdown,
    });
  } catch (error) {
    console.error("GET /api/reading-logs/summary error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
