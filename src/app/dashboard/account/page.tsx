"use client"

import * as React from "react"
import {
    User,
    Mail,
    Phone,
    MapPin,
    Globe,
    Shield,
    Lock,
    Bell,
    Eye,
    EyeOff,
    Camera,
    LogOut,
    Trash2,
    Save,
    Github,
    Twitter,
    Linkedin
} from "lucide-react"
import { useAuthStore } from "@/store/use-auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function AccountPage() {
    const { user } = useAuthStore()
    const [showPassword, setShowPassword] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success("Profile updated successfully")
        }, 1000)
    }

    const handleSaveSecurity = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success("Security settings updated")
        }, 1000)
    }

    return (
        <div className="p-6 w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and set your email preferences.
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="bg-muted/50 p-1 border h-auto">
                    <TabsTrigger value="profile" className="px-6 py-2">General</TabsTrigger>
                    <TabsTrigger value="security" className="px-6 py-2">Security</TabsTrigger>
                    <TabsTrigger value="notifications" className="px-6 py-2">Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left Column: Avatar & Summary */}
                        <Card className="md:col-span-1 border-none bg-muted/30 shadow-none">
                            <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                                <div className="relative group">
                                    <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                                        <AvatarImage src={user?.avatar} />
                                        <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                                            {user?.name?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="absolute bottom-0 right-0 rounded-full shadow-lg border-2 border-background group-hover:scale-110 transition-transform"
                                    >
                                        <Camera className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold">{user?.name}</h3>
                                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                                </div>
                                <div className="flex gap-2 w-full pt-4">
                                    <Button variant="outline" className="flex-1" size="sm">
                                        <Github className="h-4 w-4 mr-2" />
                                    </Button>
                                    <Button variant="outline" className="flex-1" size="sm">
                                        <Twitter className="h-4 w-4 mr-2" />
                                    </Button>
                                    <Button variant="outline" className="flex-1" size="sm">
                                        <Linkedin className="h-4 w-4 mr-2" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Right Column: Form */}
                        <Card className="md:col-span-2 shadow-sm border">
                            <CardHeader>
                                <CardTitle>Public Profile</CardTitle>
                                <CardDescription>
                                    This information will be displayed publicly so be careful what you share.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form id="profile-form" onSubmit={handleSaveProfile} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="display-name">Display Name</Label>
                                            <Input id="display-name" defaultValue={user?.name} placeholder="Your name" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" defaultValue={user?.email} disabled placeholder="email@example.com" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            placeholder="Brief description about yourself..."
                                            className="min-h-[100px] resize-none"
                                        />
                                        <p className="text-[12px] text-muted-foreground italic">
                                            Brief description for your profile. URLs are hyperlinked.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="location">Location</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input id="location" className="pl-9" placeholder="San Francisco, CA" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="website">Website</Label>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input id="website" className="pl-9" placeholder="https://example.com" />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                            <CardFooter className="border-t bg-muted/10 px-6 py-4 flex justify-end">
                                <Button type="submit" form="profile-form" disabled={isLoading}>
                                    {isLoading ? "Saving..." : "Update Profile"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <Card className="shadow-sm border">
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>
                                Update your password to keep your account secure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form id="security-form" onSubmit={handleSaveSecurity} className="space-y-4 max-w-md">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input type="password" id="current-password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            id="new-password"
                                            className="pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 text-muted-foreground"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                                    <Input type="password" id="confirm-password" />
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="border-t bg-muted/10 px-6 py-4 flex justify-end">
                            <Button type="submit" form="security-form" disabled={isLoading}>
                                Update Password
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-rose-500/20 bg-rose-500/5 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-rose-500 flex items-center gap-2 text-xl font-bold">
                                <Trash2 className="h-5 w-5" />
                                Danger Zone
                            </CardTitle>
                            <CardDescription>
                                Once you delete your account, there is no going back. Please be certain.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive" className="bg-rose-500 hover:bg-rose-600">
                                Delete My Account
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                    <Card className="shadow-sm border">
                        <CardHeader>
                            <CardTitle>Email Notifications</CardTitle>
                            <CardDescription>
                                Control which emails you want to receive.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between space-x-4">
                                <div className="space-y-1">
                                    <Label>Marketing Emails</Label>
                                    <p className="text-sm text-muted-foreground">Receive emails about new features and offers.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between space-x-4">
                                <div className="space-y-1">
                                    <Label>Security Alerts</Label>
                                    <p className="text-sm text-muted-foreground">Get notified about new logins and security changes.</p>
                                </div>
                                <Switch defaultChecked disabled />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between space-x-4">
                                <div className="space-y-1">
                                    <Label>Team Updates</Label>
                                    <p className="text-sm text-muted-foreground">Receive weekly summaries of team activities.</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
