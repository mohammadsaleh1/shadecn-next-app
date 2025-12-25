"use client"

import * as React from "react"
import { Bell, Check, Clock, MessageSquare, Shield, UserPlus, Zap } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Notification {
    id: string
    title: string
    description: string
    time: string
    type: 'message' | 'system' | 'team' | 'security'
    isRead: boolean
    user?: {
        name: string
        avatar: string
    }
}

const mockNotifications: Notification[] = [
    {
        id: "1",
        title: "New Message",
        description: "Sarah sent you a direct message regarding the project.",
        time: "2m ago",
        type: "message",
        isRead: false,
        user: {
            name: "Sarah Chen",
            avatar: "https://i.pravatar.cc/150?u=sarah"
        }
    },
    {
        id: "2",
        title: "Team Invite",
        description: "You've been invited to join the Marketing team.",
        time: "1h ago",
        type: "team",
        isRead: false,
    },
    {
        id: "3",
        title: "Security Alert",
        description: "New login detected from a new browser in San Francisco.",
        time: "5h ago",
        type: "security",
        isRead: true,
    },
    {
        id: "4",
        title: "System Update",
        description: "Version 2.4.0 is now live with new analytics features.",
        time: "1d ago",
        type: "system",
        isRead: true,
    }
]

export function NotificationPopover({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = React.useState(mockNotifications)
    const unreadCount = notifications.filter(n => !n.isRead).length

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    }

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'message': return <MessageSquare className="h-4 w-4 text-blue-500" />
            case 'team': return <UserPlus className="h-4 w-4 text-purple-500" />
            case 'security': return <Shield className="h-4 w-4 text-rose-500" />
            case 'system': return <Zap className="h-4 w-4 text-amber-500" />
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-[380px] p-0 shadow-2xl border-muted-foreground/20 overflow-hidden" align="end" sideOffset={8}>
                <div className="flex items-center justify-between p-4 bg-muted/30 border-b">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">Notifications</h3>
                        {unreadCount > 0 && (
                            <Badge variant="default" className="bg-primary hover:bg-primary h-5 px-1.5 min-w-[20px] justify-center">
                                {unreadCount}
                            </Badge>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8 hover:bg-primary/10 hover:text-primary transition-colors"
                        onClick={markAllAsRead}
                    >
                        Mark all as read
                    </Button>
                </div>
                <ScrollArea className="h-[400px]">
                    {notifications.length > 0 ? (
                        <div className="divide-y">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={cn(
                                        "flex gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer relative group",
                                        !notif.isRead && "bg-primary/5"
                                    )}
                                >
                                    {!notif.isRead && (
                                        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full" />
                                    )}
                                    <div className="shrink-0 pt-0.5">
                                        {notif.user ? (
                                            <Avatar className="h-10 w-10 border">
                                                <AvatarImage src={notif.user.avatar} />
                                                <AvatarFallback>{notif.user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border">
                                                {getIcon(notif.type)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className={cn("text-sm font-semibold", !notif.isRead ? "text-foreground" : "text-muted-foreground")}>
                                                {notif.title}
                                            </p>
                                            <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {notif.time}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                            {notif.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
                                <Bell className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-semibold text-muted-foreground">All caught up!</p>
                                <p className="text-xs text-muted-foreground">You have no new notifications.</p>
                            </div>
                        </div>
                    )}
                </ScrollArea>
                <div className="p-2 border-t bg-muted/10">
                    <Button variant="ghost" className="w-full text-xs h-8 text-muted-foreground hover:text-foreground">
                        View all activity
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
