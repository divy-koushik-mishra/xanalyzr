"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Search, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { UserButton, useUser, SignInButton } from "@clerk/nextjs"

interface HeaderProps {
  mobileNav?: React.ReactNode
}

export function Header({ mobileNav }: HeaderProps) {
  const { setTheme, theme } = useTheme()
  const { isSignedIn, user, isLoaded } = useUser()

  return (
    <header className="sticky top-0 z-50 flex h-[60px] items-center gap-4  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      {mobileNav}
      
      <div className="w-full flex-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {/* Notification badge removed since notifications are not dynamic */}
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="py-8 text-center text-muted-foreground text-sm">
                No notifications available
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

        {/* User Authentication */}
        {isLoaded && (
          <>
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                {/* Optional: Display user name */}
                <span className="hidden sm:inline-block text-sm font-medium">
                  {user.firstName || user.username || 'User'}
                </span>
                
                {/* Clerk UserButton with custom appearance */}
                <UserButton 
                  userProfileUrl="/dashboard/settings"
                  userProfileMode="navigation"

                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                      userButtonPopoverCard: "bg-background border",
                      userButtonPopoverActions: "text-foreground",
                    }
                  }}
                />
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </>
        )}
      </div>
    </header>
  )
}