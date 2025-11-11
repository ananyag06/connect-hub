"use client"

import type { User } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, UserIcon, LogOut } from "lucide-react"
import Link from "next/link"

interface NavBarProps {
  currentUser: User
  onLogout: () => void
}

export function NavBar({ currentUser, onLogout }: NavBarProps) {
  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    /* Updated header to LinkedIn style - white background, professional spacing */
    <header className="sticky top-0 z-50 w-full border-b border-[#D0CECA] bg-white">
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/feed" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded bg-[#0A66C2] flex items-center justify-center">
            <span className="text-white font-bold text-lg">in</span>
          </div>
          <span className="font-bold text-xl text-[#0A66C2]">Connect</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/feed">
            <Button
              variant="ghost"
              size="sm"
              className="text-[15px] text-[#65676B] hover:text-black hover:bg-transparent"
            >
              <Home className="h-5 w-5 mr-2" />
              Home
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#0A66C2] text-white text-sm font-semibold">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold">{currentUser.name}</p>
                  <p className="text-xs text-[#65676B]">{currentUser.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
}
