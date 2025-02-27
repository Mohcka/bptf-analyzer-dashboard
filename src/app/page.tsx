"use client";
import { useQuery } from "@tanstack/react-query";
import { getTopTrendingItems } from "@/db/queries";

// New component to list trending items using Tanstack Query
function TrendingItemsList() {
	// Fetch trending items using useQuery
	const { data: trendingItems, isSuccess, isLoading, error } = useQuery({
    queryKey: ['top-trending-items'],
    queryFn: () => getTopTrendingItems(),
  })
    
	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error loading items</div>;

  if(isSuccess)
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
			{trendingItems.map((item, i) => (
				<div key={i} className="bg-white dark:bg-zinc-800 p-5 rounded-lg shadow-md flex flex-col items-center gap-3">
					<div className="relative w-32 h-32 flex items-center justify-center">
						<img 
							src={item.itemImageUrl} 
							alt={item.itemBaseName} 
							className="max-h-full max-w-full object-contain"
						/>
					</div>
					<div className="text-center mt-2">
						<h3 className="text-lg font-semibold">{item.itemBaseName}</h3>
						{item.itemQualityName && (
							<p 
								className="text-sm" 
								style={{ color: item.itemColor || '#9da0a1' }}
							>
								{item.itemQualityName}
							</p>
						)}
					</div>
					<div className="flex flex-col gap-1 text-sm w-full">
						<div className="flex justify-between">
							<span className="text-zinc-600 dark:text-zinc-400">Activity:</span>
							<span className="font-medium">{item.eventCount} listings</span>
						</div>
						<div className="flex justify-between">
							<span className="text-zinc-600 dark:text-zinc-400">Avg. Price:</span>
							<span className="font-medium">
								{item.avgPriceValue ? `${item.avgPriceValue.toFixed(2)} ref` : 'N/A'}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-zinc-600 dark:text-zinc-400">Avg. USD:</span>
							<span className="font-medium">
								{item.avgPriceUsd ? `$${item.avgPriceUsd.toFixed(2)}` : 'N/A'}
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

export default function Home() {
	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-4xl">
				<h1 className="text-3xl sm:text-4xl text-center">Trending Items on BPTF 📊</h1>
				{/* Render the trending items list */}
				<TrendingItemsList />
			</main>
			<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
				<span className="text-sm text-zinc-500">Data refreshes automatically</span>
			</footer>
		</div>
	);
}
