import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateExpenseInput, ALLOWED_CATEGORIES, Category } from "@/lib/validations";

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
    orderBy: [
      { spentAt: "desc" },
      { title: "asc" },
    ],
  });

  // Ensure title sorting is case-insensitive if spentAt is equal
  expenses.sort((a, b) => {
    const timeA = new Date(a.spentAt).getTime();
    const timeB = new Date(b.spentAt).getTime();
    if (timeA !== timeB) {
      return timeB - timeA; // desc
    }
    return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
  });

  return NextResponse.json(expenses, { status: 200 });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const validation = validateExpenseInput(body);

  if (!validation.valid || !validation.parsed) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { title, amount, category, note, spentAt } = validation.parsed;

  // Check duplicate expense: same title, amount, and date for this user
  // Compare date (calendar date string YYYY-MM-DD)
  const targetDateStr = spentAt.toISOString().split("T")[0];

  const existingExpenses = await prisma.expense.findMany({
    where: {
      userId: user.id,
      amount: amount,
    },
  });

  const isDuplicate = existingExpenses.some((exp) => {
    const sameTitle =
      exp.title.trim().toLowerCase() === title.trim().toLowerCase();
    const expDateStr = new Date(exp.spentAt).toISOString().split("T")[0];
    return sameTitle && expDateStr === targetDateStr;
  });

  if (isDuplicate) {
    return NextResponse.json(
      {
        error:
          "Duplicate expense: an expense with the same title, amount and date already exists",
      },
      { status: 409 }
    );
  }

  const expense = await prisma.expense.create({
    data: {
      userId: user.id,
      title,
      amount,
      category,
      note,
      starred: false,
      spentAt,
    },
  });

  return NextResponse.json(expense, { status: 201 });
}
