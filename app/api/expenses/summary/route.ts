import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ALLOWED_CATEGORIES, Category } from "@/lib/validations";

const CATEGORY_PRIORITY: Record<string, number> = {
  Food: 1,
  Transport: 2,
  Bills: 3,
  Shopping: 4,
  Other: 5,
};

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const categoryParam = searchParams.get("category");
  const starredParam = searchParams.get("starred");
  const qParam = searchParams.get("q");

  const whereClause: any = {
    userId: user.id,
  };

  if (categoryParam && ALLOWED_CATEGORIES.includes(categoryParam as Category)) {
    whereClause.category = categoryParam;
  }

  if (starredParam === "true") {
    whereClause.starred = true;
  } else if (starredParam === "false") {
    whereClause.starred = false;
  }

  if (qParam && qParam.trim() !== "") {
    const q = qParam.trim();
    whereClause.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { note: { contains: q, mode: "insensitive" } },
    ];
  }

  const expenses = await prisma.expense.findMany({
    where: whereClause,
  });

  if (expenses.length === 0) {
    return NextResponse.json(
      {
        count: 0,
        starredCount: 0,
        totalAmount: 0,
        breakdown: [],
      },
      { status: 200 }
    );
  }

  let totalAmount = 0;
  let starredCount = 0;
  const categoryMap = new Map<string, { count: number; total: number }>();

  for (const exp of expenses) {
    totalAmount += exp.amount;
    if (exp.starred) {
      starredCount += 1;
    }

    const current = categoryMap.get(exp.category) || { count: 0, total: 0 };
    categoryMap.set(exp.category, {
      count: current.count + 1,
      total: current.total + exp.amount,
    });
  }

  const breakdown = Array.from(categoryMap.entries()).map(
    ([category, stats]) => ({
      category,
      count: stats.count,
      total: Math.round(stats.total * 100) / 100,
    })
  );

  // Sort breakdown: by total descending; if equal, tie-breaker: Food, Transport, Bills, Shopping, Other
  breakdown.sort((a, b) => {
    if (b.total !== a.total) {
      return b.total - a.total; // desc
    }
    const prioA = CATEGORY_PRIORITY[a.category] ?? 99;
    const prioB = CATEGORY_PRIORITY[b.category] ?? 99;
    return prioA - prioB;
  });

  return NextResponse.json(
    {
      count: expenses.length,
      starredCount,
      totalAmount: Math.round(totalAmount * 100) / 100,
      breakdown,
    },
    { status: 200 }
  );
}
