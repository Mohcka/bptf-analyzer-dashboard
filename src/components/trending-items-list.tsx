"use client";
import { useQuery } from "@tanstack/react-query";
import { getTopTrendingItems } from "@/db/queries";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { SkeletonCard } from "./skeleton-card";

export function TrendingItemsList() {
  // Fetch trending items using useQuery
  const { data: trendingItems, isSuccess, isLoading, error } = useQuery({
    queryKey: ['top-trending-items'],
    queryFn: () => getTopTrendingItems(),
  })
    
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {[...Array(9)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }
  
  if (error) return <div>Error loading items</div>;

  if(isSuccess)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {trendingItems.map((item, i) => (
        <Card key={i} className="flex flex-col">
          <CardHeader className="flex items-center justify-center pb-2">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <img 
                src={item.itemImageUrl} 
                alt={item.itemBaseName} 
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </CardHeader>
          <CardContent className="text-center pb-2">
            <h3 className="text-lg font-semibold">{item.itemBaseName}</h3>
            {item.itemQualityName && (
              <p 
                className="text-sm" 
                style={{ color: item.itemColor || '#9da0a1' }}
              >
                {item.itemQualityName}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-1 text-sm w-full pt-2 border-t">
            <div className="flex justify-between w-full">
              <span className="text-zinc-600 dark:text-zinc-400">Activity:</span>
              <span className="font-medium">{item.eventCount} listings</span>
            </div>
            <div className="flex justify-between w-full">
              <span className="text-zinc-600 dark:text-zinc-400">Avg. Price:</span>
              <span className="font-medium">
                {item.avgPriceValue ? `${item.avgPriceValue.toFixed(2)} ref` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between w-full">
              <span className="text-zinc-600 dark:text-zinc-400">Avg. USD:</span>
              <span className="font-medium">
                {item.avgPriceUsd ? `$${item.avgPriceUsd.toFixed(2)}` : 'N/A'}
              </span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
