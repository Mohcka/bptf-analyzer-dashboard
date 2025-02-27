"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChartLine, Home, ListFilter, Settings } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

const sidebarLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Trends", href: "/trends", icon: ChartLine },
  { name: "Items", href: "/items", icon: ListFilter },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="h-screen border-r flex flex-col bg-background">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">BPTF Analyzer</h1>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-2 px-2">
          {sidebarLinks.map((link) => {
            const LinkIcon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === link.href ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <LinkIcon className="h-4 w-4" />
                <span>{link.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="p-4 border-t flex justify-between items-center">
        <span className="text-sm text-muted-foreground">v1.0.0</span>
        <ThemeToggle />
      </div>
    </div>
  )
}
