"use client"

import * as React from "react"
import { Send, ArrowLeft, Search, MoreVertical, Phone, Video } from "lucide-react"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface User {
    id: string
    name: string
    avatar: string
    status: "online" | "offline"
    lastMessage?: string
    lastMessageTime?: string
}

interface Message {
    id: string
    content: string
    sender: "me" | "other"
    timestamp: string
}

const MOCK_USERS: User[] = [
    {
        id: "1",
        name: "Alice Smith",
        avatar: "/avatars/01.png",
        status: "online",
        lastMessage: "Hey, are we still on for the meeting?",
        lastMessageTime: "10:30 AM"
    },
    {
        id: "2",
        name: "Bob Jones",
        avatar: "/avatars/02.png",
        status: "offline",
        lastMessage: "The project looks great!",
        lastMessageTime: "Yesterday"
    },
    {
        id: "3",
        name: "Charlie Brown",
        avatar: "/avatars/03.png",
        status: "online",
        lastMessage: "Can you send me the files?",
        lastMessageTime: "Mon"
    },
    {
        id: "4",
        name: "Diana Prince",
        avatar: "/avatars/04.png",
        status: "offline",
        lastMessage: "Thanks for your help!",
        lastMessageTime: "Sun"
    }
]

// Mock initial messages for each user
const MOCK_MESSAGES: Record<string, Message[]> = {
    "1": [
        { id: "1", content: "Hi Alice!", sender: "me", timestamp: "10:00 AM" },
        { id: "2", content: "Hey! Long time no see.", sender: "other", timestamp: "10:05 AM" },
        { id: "3", content: "Are we still on for the meeting?", sender: "other", timestamp: "10:30 AM" }
    ],
    "2": [
        { id: "1", content: "Did you see the new design?", sender: "me", timestamp: "Yesterday" },
        { id: "2", content: "The project looks great!", sender: "other", timestamp: "Yesterday" }
    ]
}

export function ChatSheet({ children }: { children: React.ReactNode }) {
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
    const [activeMessages, setActiveMessages] = React.useState<Message[]>([])
    const [inputValue, setInputValue] = React.useState("")
    const [searchQuery, setSearchQuery] = React.useState("")

    React.useEffect(() => {
        if (selectedUser) {
            setActiveMessages(MOCK_MESSAGES[selectedUser.id] || [])
        }
    }, [selectedUser])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputValue.trim() || !selectedUser) return

        const newMessage: Message = {
            id: Date.now().toString(),
            content: inputValue,
            sender: "me",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setActiveMessages([...activeMessages, newMessage])
        setInputValue("")

        // Mock response
        setTimeout(() => {
            const responseMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: `Echo: ${inputValue}`,
                sender: "other",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            setActiveMessages(prev => [...prev, responseMessage])
        }, 1000)
    }

    const filteredUsers = MOCK_USERS.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0 gap-0">
                {!selectedUser ? (
                    // USER LIST VIEW
                    <>
                        <SheetHeader className="p-4 border-b space-y-4">
                            <SheetTitle className="text-2xl font-bold">Chats</SheetTitle>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search Messenger"
                                    className="pl-8 bg-muted/50 border-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </SheetHeader>
                        <ScrollArea className="flex-1">
                            <div className="flex flex-col">
                                {filteredUsers.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => setSelectedUser(user)}
                                        className="flex items-center gap-3 p-3 mx-2 my-1 rounded-lg hover:bg-muted/80 transition-colors text-left group"
                                    >
                                        <div className="relative">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            {user.status === "online" && (
                                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                                            )}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="font-semibold text-sm">{user.name}</div>
                                            <div className="text-xs text-muted-foreground truncate group-hover:text-foreground/80">
                                                {user.lastMessage && (
                                                    <span className={`${user.status === 'online' ? 'font-medium text-foreground' : ''}`}>
                                                        {user.lastMessage}
                                                    </span>
                                                )}
                                                {!user.lastMessage && "Start a conversation"}
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground whitespace-nowrap self-start mt-1">
                                            {user.lastMessageTime}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </>
                ) : (
                    // ACTIVE CHAT VIEW
                    <>
                        <SheetHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="-ml-2 h-8 w-8 rounded-full"
                                    onClick={() => setSelectedUser(null)}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                                    <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold text-sm">{selectedUser.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {selectedUser.status === "online" ? "Active now" : "Offline"}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                                    <Phone className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                                    <Video className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-5 w-5" />
                                </Button>
                            </div>
                        </SheetHeader>

                        <ScrollArea className="flex-1 p-4 bg-muted/10">
                            <div className="flex flex-col gap-2 min-h-full justify-end">
                                <div className="flex flex-col items-center justify-center p-8 gap-2 text-center text-muted-foreground mb-auto">
                                    <Avatar className="h-20 w-20 mb-2">
                                        <AvatarImage src={selectedUser.avatar} />
                                        <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <h3 className="font-semibold text-lg text-foreground">{selectedUser.name}</h3>
                                    <p className="text-sm">You are friends on NextShad</p>
                                </div>

                                {activeMessages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex gap-2 max-w-[75%] ${message.sender === "me" ? "ml-auto flex-row-reverse" : ""
                                            }`}
                                    >
                                        {message.sender === "other" && (
                                            <Avatar className="h-6 w-6 self-end mb-1">
                                                <AvatarImage src={selectedUser.avatar} />
                                                <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div
                                            className={`rounded-2xl px-4 py-2 text-sm ${message.sender === "me"
                                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                                    : "bg-muted rounded-bl-none"
                                                }`}
                                        >
                                            {message.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="p-3 border-t">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <Input
                                    placeholder="Aa"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="flex-1 rounded-full bg-muted/50 border-none focus-visible:ring-1"
                                />
                                <Button type="submit" size="icon" className="h-9 w-9 rounded-full shrink-0">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}
