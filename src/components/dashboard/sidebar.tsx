"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  LayoutDashboard, 
  Settings, 
  Package, 
  Menu,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Grid3X3,
  HelpCircle,
} from "lucide-react"
import { useState } from "react"

const sidebarNavGroups = [
  {
    title: "General",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Uploaded Files",
        href: "/dashboard/data",
        icon: CheckSquare,
      },
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: Grid3X3,
      },
    ]
  },
  {
    title: "Other",
    items: [
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
      {
        title: "Help Center",
        href: "/dashboard/help",
        icon: HelpCircle,
      },
    ]
  }
]

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn(
      "fixed left-0 top-0 z-50 hidden h-full bg-background transition-all duration-300 md:block",
      isCollapsed ? "w-16" : "w-60"
    )}>
      <div className={`bg-background h-full ${isCollapsed ? "p-0" : "p-2"}`}>
      <div className="flex h-full max-h-screen flex-col bg-card border border-border text-card-foreground rounded-lg">
        {/* Header */}
        <div className="flex h-[60px] items-center border-b border-border px-3">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
                <Package className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Xanalyzr</span>
                <span className="text-xs text-muted-foreground">Visualize your data</span>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <div className="flex w-full justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
                <Package className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-6 px-3">
            {sidebarNavGroups.map((group) => (
              <div key={group.title}>
                {!isCollapsed && (
                  <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "group flex items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground",
                          isActive && "bg-primary text-primary-foreground",
                          isCollapsed && "justify-center px-2"
                        )}
                        title={isCollapsed ? item.title : undefined}
                      >
                        <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                        {!isCollapsed && (
                          <div className="flex flex-1 items-center justify-between">
                            <span>{item.title}</span>
                            {/* {item.badge && (
                              <Badge variant="secondary" className="ml-auto text-xs">
                                {item.badge}
                              </Badge>
                            )} */}
                          </div>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Collapse Toggle Button */}
        <div className="border-t border-border p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "w-full text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              isCollapsed && "px-2"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
      </div>
    </div>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0 bg-card text-card-foreground border-border">
        {/* Mobile Header */}
        <div className="flex h-[60px] items-center border-b border-border px-6">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 font-semibold"
            onClick={() => setOpen(false)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
              <Package className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Xanalyzr</span>
              <span className="text-xs text-muted-foreground">Visualize your data</span>
            </div>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-6 px-4">
            {sidebarNavGroups.map((group) => (
              <div key={group.title}>
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground",
                          isActive && "bg-primary text-primary-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <div className="flex flex-1 items-center justify-between">
                          <span>{item.title}</span>
                          {/* {item.badge && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {item.badge}
                            </Badge>
                          )} */}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
} 