"use client";
import { TrendingItemsList } from "@/components/trending-items-list";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center w-full max-w-4xl">
        <h1 className="text-3xl sm:text-4xl text-center">Trending Items on BPTF 📊</h1>
        <TrendingItemsList />
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center">
        <span className="text-sm text-zinc-500">Data refreshes automatically</span>
      </footer>
    </div>
  );
}
