import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fourBooks = [
  {
    bookTitle: "Truyện Cổ Tích & Thế Giới Thần Thoại",
    genre: "Fiction",
    minutes: 55,
    notes: "Tuyển tập truyện cổ tích dân gian huyền ảo, bài học về lòng nhân ái, sự quả cảm và niềm tin vào lẽ phải.",
    isFavorite: true,
    readAt: new Date("2026-11-06T11:00:00Z"),
  },
  {
    bookTitle: "Hồ Điệp & Kình Ngư",
    genre: "Fiction",
    minutes: 70,
    notes: "Tiểu thuyết lãng mạn phương Đông về mối liên kết tâm hồn giữa cánh bướm trên bầu trời và chú cá voi nơi đại dương.",
    isFavorite: true,
    readAt: new Date("2026-11-06T11:45:00Z"),
  },
  {
    bookTitle: "Điều Kỳ Diệu Của Tiệm Tạp Hóa Namiya",
    genre: "Fiction",
    minutes: 85,
    notes: "Kiệt tác của Higashino Keigo về những phong thư vượt thời gian 33 năm, sức mạnh của sự lắng nghe và lòng trắc ẩn cứu rỗi số phận.",
    isFavorite: true,
    readAt: new Date("2026-11-06T12:15:00Z"),
  },
  {
    bookTitle: "Poster Chữ & Nghệ Thuật Typography Nhật Bản",
    genre: "Other",
    minutes: 45,
    notes: "Khám phá vẻ đẹp thị giác của nghệ thuật chữ, triết lý khoảng lặng (Ma) và thẩm mỹ thiết kế bìa ấn phẩm xuất bản.",
    isFavorite: false,
    readAt: new Date("2026-11-06T12:45:00Z"),
  },
];

async function main() {
  console.log("Connecting to Supabase database...");
  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  console.log(`Found ${users.length} user(s):`, users.map((u) => u.email));

  for (const user of users) {
    console.log(`\nAdding 4 featured books for: ${user.email} (${user.id})`);
    for (const book of fourBooks) {
      const existing = await prisma.readingLog.findFirst({
        where: {
          userId: user.id,
          bookTitle: book.bookTitle,
        },
      });

      if (!existing) {
        const created = await prisma.readingLog.create({
          data: {
            userId: user.id,
            bookTitle: book.bookTitle,
            genre: book.genre,
            minutes: book.minutes,
            notes: book.notes,
            isFavorite: book.isFavorite,
            readAt: book.readAt,
          },
        });
        console.log(`+ Added: "${created.bookTitle}" (${created.genre}, ${created.minutes} min)`);
      } else {
        console.log(`= Already exists: "${book.bookTitle}"`);
      }
    }
  }

  const total = await prisma.readingLog.count();
  console.log(`\nSuccess! Total reading logs now in database: ${total}`);
}

main()
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
