"use client";
import { useQuery } from "@tanstack/react-query";
import { getTopTrendingItems } from "@/db/queries/trending";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { SkeletonCard } from "./skeleton-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Import correct Shadcn chart components
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Import Recharts components directly - these aren't exported from chart.tsx
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

export function TrendingItemsList() {
  // Fetch trending items using useQuery
  const { data, isSuccess, isLoading, error } = useQuery({
    queryKey: ['top-trending-items'],
    queryFn: () => getTopTrendingItems(),
    placeholderData: (prevData) => prevData,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full px-2 md:px-0">
        {[...Array(9)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) return <div>Error loading items</div>;

  if (isSuccess && data) {
    const { items: trendingItems, hourlyData } = data;
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full px-2 md:px-0">
        {trendingItems.map((item, i) => {
          // Prepare chart data if available
          const hasChartData = hourlyData && hourlyData[item.itemName] && hourlyData[item.itemName].length > 0;
          
          const chartData = hasChartData 
            ? hourlyData[item.itemName]
                .slice(1, -1) // Remove both the first and most recent hour
                .map((count, index) => ({ 
                  hour: index + 1, // Add 1 to index since we're skipping first hour
                  count: count 
                }))
            : [];

          // Configure chart
          const chartConfig = {
            count: {
              label: "Listings",
              color: item.itemColor || "#3B82F6",
            }
          };
          
          return (
            <Card key={i} className="flex flex-col">
              <CardHeader className="flex flex-col items-center justify-center pb-2 px-3 md:px-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center">
                  <img
                    src={item.itemImageUrl}
                    alt={item.itemName}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="text-center mt-2">
                  <h3 className="text-base sm:text-lg font-semibold">{item.itemName}</h3>
                  {item.itemQualityName && (
                    <Badge 
                      className="mt-1 font-medium"
                      style={{ 
                        backgroundColor: `${item.itemColor}20` || '#9da0a120',
                        color: item.itemColor || '#9da0a1',
                        borderColor: `${item.itemColor}40` || '#9da0a140'
                      }}
                      variant="outline"
                    >
                      {item.itemQualityName}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-1 text-xs sm:text-sm w-full pt-2 px-3 md:px-4 border-t">
                <div className="flex justify-between w-full">
                  <span className="text-zinc-600 dark:text-zinc-400">Creations/Updates:</span>
                  <span className="font-medium">{item.updateCount} listings</span>
                </div>
                <div className="flex justify-between w-full">
                  <span className="text-zinc-600 dark:text-zinc-400">Deletions:</span>
                  <span className="font-medium">{item.deleteCount} listings</span>
                </div>
                <div className="flex justify-between w-full">
                  <span className="text-zinc-600 dark:text-zinc-400">Total difference:</span>
                  <span className="font-medium">{item.updateCount - item.deleteCount} listings</span>
                </div>
                <div className="flex justify-between w-full mt-1 pt-1 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-zinc-600 dark:text-zinc-400">Avg. Price:</span>
                  <span className="font-medium">
                    {item.avgKeysAmount || item.avgMetalAmount ?
                      `${item.avgKeysAmount ? `${item.avgKeysAmount.toFixed(1)} keys` : ''}${item.avgKeysAmount && item.avgMetalAmount ? ', ' : ''}${item.avgMetalAmount ? `${item.avgMetalAmount.toFixed(2)} ref` : ''}`
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between w-full">
                  <span className="text-zinc-600 dark:text-zinc-400">Avg. USD:</span>
                  <span className="font-medium">
                    {item.avgPriceUsd ? `$${item.avgPriceUsd.toFixed(2)}` : 'N/A'}
                  </span>
                </div>
              </CardContent>
              
              {hasChartData && (
                <CardFooter className="pt-3 px-3 md:pt-4 md:px-4 pb-4">
                  <Tabs defaultValue="line" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="line">Trend</TabsTrigger>
                      <TabsTrigger value="area">Activity</TabsTrigger>
                    </TabsList>
                    <TabsContent value="line" className="space-y-2 md:space-y-4">
                      <ChartContainer config={chartConfig} className="h-[120px] sm:h-[130px] md:h-[150px] w-full">
                        <LineChart 
                          width={500} 
                          height={150}
                          data={chartData}
                          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                        >
                          <XAxis 
                            dataKey="hour" 
                            tickLine={false}
                            axisLine={false}
                            tick={{fontSize: 10}}
                          />
                          <YAxis 
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                            tick={{fontSize: 10}}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke={item.itemColor || "#3B82F6"}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ChartContainer>
                    </TabsContent>
                    <TabsContent value="area" className="space-y-2 md:space-y-4">
                      <ChartContainer config={chartConfig} className="h-[120px] sm:h-[130px] md:h-[150px] w-full">
                        <AreaChart 
                          width={500} 
                          height={150}
                          data={chartData}
                          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="hour" 
                            tickLine={false}
                            axisLine={false}
                            tick={{fontSize: 10}}
                          />
                          <YAxis 
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                            tick={{fontSize: 10}}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area
                            type="monotone"
                            dataKey="count"
                            stroke={item.itemColor || "#3B82F6"}
                            fill={item.itemColor || "#3B82F6"}
                            fillOpacity={0.2}
                          />
                        </AreaChart>
                      </ChartContainer>
                    </TabsContent>
                  </Tabs>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>
    );
  }
  
  return null;
}
