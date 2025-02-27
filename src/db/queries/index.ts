"use server";

import { db } from "@/db";
import { listingEventsTable } from "@/db/schema";
import { and, between, eq, sql, desc } from "drizzle-orm";

// Define the return type for better type safety
type TrendingItem = {
  itemBaseName: string;
  itemQualityName: string | null;  // Updated to allow null
  itemImageUrl: string;
  itemColor: string | null;  // Added item color
  avgPriceValue: number | null;
  avgPriceUsd: number | null;
  eventCount: number;
}

export async function getTopTrendingItems(itemCount: number = 10, timeFrameInMinutes: number = 60): Promise<TrendingItem[]> {
  const now = new Date();
  const timeAgo = new Date(now.getTime() - timeFrameInMinutes * 60 * 1000);

  const result = await db
    .select({
      itemBaseName: listingEventsTable.itemBaseName,
      itemQualityName: listingEventsTable.itemQualityName,
      itemImageUrl: sql<string>`MAX(${listingEventsTable.itemImageUrL})`.as("itemImageUrl"),
      itemColor: sql<string | null>`MAX(${listingEventsTable.itemQualityColor})`.as("itemColor"),
      avgPriceValue: sql<number | null>`AVG(${listingEventsTable.valueRaw})`.as("avgPriceValue"),
      avgPriceUsd: sql<number | null>`AVG(${listingEventsTable.itemPriceUsd})`.as("avgPriceUsd"),
      eventCount: sql<number>`COUNT(*)`.as("eventcount")
    })
    .from(listingEventsTable)
    .where(
      and(
        eq(listingEventsTable.event, "listing-update"),
        between(listingEventsTable.createdAt, timeAgo, now)
      )
    )
    .groupBy(listingEventsTable.itemBaseName, listingEventsTable.itemQualityName)
    .orderBy(desc(sql`eventcount`))
    .limit(itemCount);

  // Convert string values to numbers.
  const convertedResult: TrendingItem[] = result.map(item => ({
    ...item,
    avgPriceValue: item.avgPriceValue !== null ? Number(item.avgPriceValue) : null,
    avgPriceUsd: item.avgPriceUsd !== null ? Number(item.avgPriceUsd) : null,
    eventCount: Number(item.eventCount),
  }));

  return convertedResult;
}

