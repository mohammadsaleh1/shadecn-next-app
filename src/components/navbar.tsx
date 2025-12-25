"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Zap, User, LogOut, Settings } from "lucide-react"
import { useAuthStore } from "@/store/use-auth-store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/5 backdrop-blur-md transition-all supports-[backdrop-filter]:bg-black/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            NextShad
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Testimonials
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Pricing
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0">
                Get Started
              </Button>
            </>
          )}
          <ModeToggle />
        </div>

        <div className="md:hidden flex items-center space-x-2">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black/95 border-l-white/10">
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="#features" className="text-lg font-medium text-foreground hover:text-primary">
                  Features
                </Link>
                <Link href="#testimonials" className="text-lg font-medium text-foreground hover:text-primary">
                  Testimonials
                </Link>
                <Link href="#pricing" className="text-lg font-medium text-foreground hover:text-primary">
                  Pricing
                </Link>
                <div className="pt-4 flex flex-col space-y-2">
                  {isAuthenticated ? (
                    <Button variant="outline" className="w-full" onClick={() => logout()}>Log Out</Button>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/login">Sign In</Link>
                      </Button>
                      <Button className="w-full bg-primary text-primary-foreground">Get Started</Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
