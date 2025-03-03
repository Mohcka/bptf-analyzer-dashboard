"use server";

import { getTopItemsActivityForChart } from '@/db/queries/get-item-activity';

/**
 * Server action to retrieve trending items with hourly activity data
 * 
 * @param topItemsCount Number of most active items to retrieve (default: 10)
 * @param hoursToShow Number of most recent hours to include in the chart (default: 24)
 * @returns Array of items with their hourly activity data
 */
export async function getTrendingItems(topItemsCount = 10, hoursToShow = 24) {
  return getTopItemsActivityForChart(topItemsCount, hoursToShow);
}
