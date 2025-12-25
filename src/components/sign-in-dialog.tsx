"use client"

import { useState } from "react"
import { useAuthStore } from "@/store/use-auth-store"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Lock, Mail } from "lucide-react"

export function SignInDialog() {
    const { isAuthModalOpen, closeAuthModal, login, isLoading } = useAuthStore()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await login(email, password)
    }

    return (
        <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-center text-white">Welcome back</DialogTitle>
                    <DialogDescription className="text-center text-zinc-400">
                        Enter your email to sign in to your account
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-zinc-200">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className="pl-9 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-zinc-200">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-9 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>
                <DialogFooter className="flex flex-col sm:flex-col items-center gap-2">
                    <div className="text-xs text-zinc-500 text-center">
                        By clicking continue, you agree to our{" "}
                        <a href="#" className="underline hover:text-zinc-300">Terms of Service</a>{" "}
                        and{" "}
                        <a href="#" className="underline hover:text-zinc-300">Privacy Policy</a>.
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
