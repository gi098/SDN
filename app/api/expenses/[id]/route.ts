import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ALLOWED_CATEGORIES, Category } from "@/lib/validations";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.expense.findUnique({
    where: { id },
  });

  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const updateData: any = {};

  // Title validation
  if (body.title !== undefined) {
    const title = String(body.title).trim();
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }
    if (title.length > 80) {
      return NextResponse.json(
        { error: "Title must be at most 80 characters" },
        { status: 400 }
      );
    }
    updateData.title = title;
  }

  // Amount validation
  if (body.amount !== undefined) {
    if (body.amount === null || String(body.amount).trim() === "") {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }
    const numAmount = Number(body.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }
    updateData.amount = Math.round(numAmount * 100) / 100;
  }

  // Category validation
  if (body.category !== undefined) {
    const category = String(body.category).trim();
    if (!category) {
      return NextResponse.json(
        { error: "Please choose a category" },
        { status: 400 }
      );
    }
    if (!ALLOWED_CATEGORIES.includes(category as Category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }
    updateData.category = category;
  }

  // Note validation
  if (body.note !== undefined) {
    updateData.note = body.note === null ? "" : String(body.note).trim();
  }

  // Starred validation
  if (body.starred !== undefined) {
    updateData.starred = Boolean(body.starred);
  }

  // spentAt validation
  if (body.spentAt !== undefined) {
    if (!body.spentAt || String(body.spentAt).trim() === "") {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }
    const date = new Date(String(body.spentAt));
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      );
    }
    const now = new Date();
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );
    if (date.getTime() > endOfToday.getTime()) {
      return NextResponse.json(
        { error: "Date cannot be in the future" },
        { status: 400 }
      );
    }
    updateData.spentAt = date;
  }

  // Duplicate check if title, amount, or spentAt are updated
  if (
    updateData.title !== undefined ||
    updateData.amount !== undefined ||
    updateData.spentAt !== undefined
  ) {
    const targetTitle = updateData.title ?? existing.title;
    const targetAmount = updateData.amount ?? existing.amount;
    const targetSpentAt = updateData.spentAt ?? existing.spentAt;
    const targetDateStr = new Date(targetSpentAt).toISOString().split("T")[0];

    const otherExpenses = await prisma.expense.findMany({
      where: {
        userId: user.id,
        amount: targetAmount,
        NOT: { id: existing.id },
      },
    });

    const isDuplicate = otherExpenses.some((exp) => {
      const sameTitle =
        exp.title.trim().toLowerCase() === targetTitle.trim().toLowerCase();
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
  }

  const updated = await prisma.expense.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(updated, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.expense.findUnique({
    where: { id },
  });

  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  await prisma.expense.delete({
    where: { id },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
