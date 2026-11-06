import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleBooks = [
  {
    bookTitle: "Clean Code: A Handbook of Agile Software Craftsmanship",
    genre: "Non-Fiction",
    minutes: 60,
    notes: "Focused on meaningful naming conventions, function length, and the Single Responsibility Principle.",
    isFavorite: true,
    readAt: new Date("2026-11-06T10:30:00Z"),
  },
  {
    bookTitle: "Atomic Habits",
    genre: "Non-Fiction",
    minutes: 45,
    notes: "The 1% compounding improvement concept, cue-craving-response-reward loop, and identity-based habits.",
    isFavorite: true,
    readAt: new Date("2026-11-05T14:15:00Z"),
  },
  {
    bookTitle: "Dune",
    genre: "Fiction",
    minutes: 90,
    notes: "Exploring the ecology of Arrakis, desert survival, and the political machinations of the Great Houses.",
    isFavorite: true,
    readAt: new Date("2026-11-04T20:00:00Z"),
  },
  {
    bookTitle: "A Brief History of Time",
    genre: "Science",
    minutes: 50,
    notes: "Chapters on black holes, cosmic horizons, the arrow of time, and general relativity.",
    isFavorite: false,
    readAt: new Date("2026-11-03T16:45:00Z"),
  },
  {
    bookTitle: "Sapiens: A Brief History of Humankind",
    genre: "History",
    minutes: 75,
    notes: "The cognitive revolution, agricultural shift, and how collective belief systems united large human societies.",
    isFavorite: true,
    readAt: new Date("2026-11-02T19:30:00Z"),
  },
  {
    bookTitle: "The Pragmatic Programmer",
    genre: "Other",
    minutes: 40,
    notes: "Orthogonality in design, broken windows theory, and treating documentation as an integral artifact.",
    isFavorite: false,
    readAt: new Date("2026-11-01T09:15:00Z"),
  },
  {
    bookTitle: "Thinking, Fast and Slow",
    genre: "Science",
    minutes: 65,
    notes: "Heuristics and biases: anchoring effect, availability heuristic, and framing in decision making.",
    isFavorite: false,
    readAt: new Date("2026-10-31T15:00:00Z"),
  },
  {
    bookTitle: "The Great Gatsby",
    genre: "Fiction",
    minutes: 35,
    notes: "Symbolism of the green light, disillusionment with the American Dream, and 1920s jazz age excesses.",
    isFavorite: false,
    readAt: new Date("2026-10-30T21:10:00Z"),
  },
  {
    bookTitle: "Guns, Germs, and Steel",
    genre: "History",
    minutes: 80,
    notes: "How geographical luck, continental axes, and domesticable species shaped unequal continental development.",
    isFavorite: true,
    readAt: new Date("2026-10-29T17:20:00Z"),
  },
  {
    bookTitle: "Designing Data-Intensive Applications",
    genre: "Non-Fiction",
    minutes: 95,
    notes: "Reliability, scalability, maintainability, LSM-trees, B-trees, and replication topologies.",
    isFavorite: true,
    readAt: new Date("2026-10-28T18:40:00Z"),
  },
];

async function main() {
  console.log("Connecting to database...");
  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  console.log(`Found ${users.length} user(s) in database:`, users.map((u) => u.email));

  if (users.length === 0) {
    console.log("No users found. Please register an account first or run seed with a created user.");
    return;
  }

  for (const user of users) {
    console.log(`\nAdding 10 books for user: ${user.email} (${user.id})...`);
    for (const book of sampleBooks) {
      // Check if book already exists for this user to avoid duplicates
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

  console.log("\nDone seeding 10 books!");
}

main()
  .catch((err) => {
    console.error("Error during seeding:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

