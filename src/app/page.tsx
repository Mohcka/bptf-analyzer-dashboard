import { db } from "@/db";
import { listingsTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import Image from "next/image";

async function getLatestListings() {
  "use server"
  return await db
    .select()
    .from(listingsTable)
    .orderBy(desc(listingsTable.listedAt))
    .limit(10)
    .execute();
}

export default async function Home() {
  const listings = await getLatestListings();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl sm:text-4xl text-center sm:text-left">Welcome to
          BPTF Dashboard 📊</h1>

        {listings.map((l, i) => (
          <h3 key={i} className="text-lg sm:text-xl">
            New! 💥 listing from {l.username} -- {l.details}
            <img src={l.userAvatar} alt={l.username} height={128} width={128} />
          </h3>
        ))}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}

export const dynamic = 'force-dynamic'