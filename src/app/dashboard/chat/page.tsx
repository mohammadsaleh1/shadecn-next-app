"use client"

import * as React from "react"
import { Send, ArrowLeft, Search, MoreVertical, Phone, Video, Paperclip, Mic, Image as ImageIcon, Smile, X, Square } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import EmojiPicker from 'emoji-picker-react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface User {
    id: string
    name: string
    avatar: string
    status: "online" | "offline" | "busy"
    lastMessage?: string
    lastMessageTime?: string
    unreadCount?: number
}

interface Message {
    id: string
    content: string
    type: "text" | "audio"
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
        lastMessageTime: "10:30 AM",
        unreadCount: 2
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
        status: "busy",
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

const MOCK_MESSAGES: Record<string, Message[]> = {
    "1": [
        { id: "1", content: "Hi Alice!", sender: "me", type: "text", timestamp: "10:00 AM" },
        { id: "2", content: "Hey! Long time no see.", sender: "other", type: "text", timestamp: "10:05 AM" },
        { id: "3", content: "Are we still on for the meeting? I have some updates regarding the Q3 roadmap that I'd like to discuss with the team.", sender: "other", type: "text", timestamp: "10:30 AM" },
        { id: "4", content: "Yes, definitely. Let's meet at 2 PM.", sender: "me", type: "text", timestamp: "10:32 AM" }
    ],
    "2": [
        { id: "1", content: "Did you see the new design?", sender: "me", type: "text", timestamp: "Yesterday" },
        { id: "2", content: "The project looks great! I really like the new dark mode implementation.", sender: "other", type: "text", timestamp: "Yesterday" }
    ]
}

export default function ChatPage() {
    const isMobile = useIsMobile()
    const [selectedUser, setSelectedUser] = React.useState<User>(MOCK_USERS[0])
    const [activeMessages, setActiveMessages] = React.useState<Message[]>([])
    const [inputValue, setInputValue] = React.useState("")
    const [searchQuery, setSearchQuery] = React.useState("")
    const [mobileChatOpen, setMobileChatOpen] = React.useState(false)

    // Audio Recording State
    const [isRecording, setIsRecording] = React.useState(false)
    const [recordingDuration, setRecordingDuration] = React.useState(0)
    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
    const chunksRef = React.useRef<Blob[]>([])
    const timerRef = React.useRef<NodeJS.Timeout | null>(null)

    const scrollAreaRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (selectedUser) {
            setActiveMessages(MOCK_MESSAGES[selectedUser.id] || [])
        }
    }, [selectedUser])

    // Auto-scroll to bottom of chat
    React.useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [activeMessages])

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            chunksRef.current = []

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data)
                }
            }

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
                const audioUrl = URL.createObjectURL(blob)
                sendAudioMessage(audioUrl)

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop())
            }

            mediaRecorder.start()
            setIsRecording(true)

            // Start Timer
            setRecordingDuration(0)
            timerRef.current = setInterval(() => {
                setRecordingDuration(prev => prev + 1)
            }, 1000)

        } catch (err) {
            console.error("Error accessing microphone:", err)
            alert("Could not access microphone. Please allow permissions.")
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            if (timerRef.current) {
                clearInterval(timerRef.current)
                timerRef.current = null
            }
        }
    }

    const cancelRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            // Stop but don't define the onstop to send
            mediaRecorderRef.current.onstop = null
            mediaRecorderRef.current.stop()
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())

            setIsRecording(false)
            if (timerRef.current) {
                clearInterval(timerRef.current)
                timerRef.current = null
            }
            setRecordingDuration(0)
        }
    }

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const sendAudioMessage = (audioUrl: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            content: audioUrl,
            type: "audio",
            sender: "me",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setActiveMessages(prev => [...prev, newMessage])
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputValue.trim()) return

        const newMessage: Message = {
            id: Date.now().toString(),
            content: inputValue,
            type: "text",
            sender: "me",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setActiveMessages([...activeMessages, newMessage])
        setInputValue("")

        // Mock response
        setTimeout(() => {
            const responseMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: `I received your message: "${inputValue}"`,
                type: "text",
                sender: "other",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            setActiveMessages(prev => [...prev, responseMessage])
        }, 1000)
    }

    const onEmojiClick = (emojiObject: any) => {
        setInputValue(prev => prev + emojiObject.emoji)
    }

    const filteredUsers = MOCK_USERS.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleUserSelect = (user: User) => {
        setSelectedUser(user)
        setMobileChatOpen(true)
    }

    // SHARED INPUT COMPONENT
    const ChatInput = () => (
        <div className="p-4 bg-background border-t">
            {isRecording ? (
                <div className="flex items-center gap-4 px-2 h-[52px]">
                    <div className="flex items-center gap-2 text-red-500 animate-pulse font-mono">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        {formatDuration(recordingDuration)}
                    </div>
                    <div className="flex-1" />
                    <Button variant="ghost" onClick={cancelRecording} className="text-muted-foreground hover:text-destructive">
                        Cancel
                    </Button>
                    <Button size="icon" onClick={stopRecording} className="h-10 w-10 rounded-full bg-red-500 hover:bg-red-600 text-white">
                        <Square className="h-4 w-4 fill-current" />
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSendMessage} className="flex items-end gap-2 px-2">
                    <div className="flex items-center gap-1 mb-2">
                        <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full">
                            <Paperclip className="h-5 w-5" />
                        </Button>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full">
                                    <Smile className="h-5 w-5" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start" className="w-auto p-0 border-none">
                                <EmojiPicker onEmojiClick={onEmojiClick} theme={undefined} />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="flex-1 bg-muted/30 border rounded-2xl flex items-center px-4 py-2 gap-2 focus-within:ring-1 focus-within:ring-ring focus-within:border-primary transition-all">
                        <Input
                            placeholder="Type a message..."
                            className="border-none bg-transparent shadow-none focus-visible:ring-0 p-0 h-auto min-h-[24px] max-h-[120px] resize-none"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>

                    <div className="mb-0.5">
                        {inputValue.trim() ? (
                            <Button type="submit" size="icon" className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 transition-all">
                                <Send className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button type="button" onClick={startRecording} size="icon" className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 transition-all">
                                <Mic className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                </form>
            )}
        </div>
    )

    // SHARED MESSAGE RENDERER
    const renderMessages = () => (
        <div className="flex flex-col gap-4">
            {/* Date Separator Example */}
            <div className="flex justify-center my-4">
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                    Yesterday
                </span>
            </div>

            {activeMessages.map((message) => (
                <div
                    key={message.id}
                    className={cn(
                        "flex gap-3 w-full",
                        message.sender === "me" ? "justify-end" : "justify-start"
                    )}
                >
                    {message.sender === "other" && (
                        <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage src={selectedUser.avatar} />
                            <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    )}

                    <div className={cn("group flex flex-col gap-1 max-w-[80%]", message.sender === "me" ? "items-end" : "items-start")}>
                        {message.type === 'text' ? (
                            <div
                                className={cn(
                                    "px-4 py-2.5 text-sm shadow-sm relative",
                                    message.sender === "me"
                                        ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                                        : "bg-card text-card-foreground border rounded-2xl rounded-tl-sm"
                                )}
                            >
                                {message.content}
                            </div>
                        ) : (
                            <div className={cn(
                                "p-2 shadow-sm relative flex items-center gap-2 min-w-[200px]",
                                message.sender === "me"
                                    ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                                    : "bg-card text-card-foreground border rounded-2xl rounded-tl-sm"
                            )}>
                                <audio controls src={message.content} className="h-8 w-full max-w-[250px]" />
                            </div>
                        )}

                        <span className={cn(
                            "text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity",
                            message.sender === "me" ? "text-right" : "text-left"
                        )}>
                            {message.timestamp}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )

    if (isMobile) {
        if (mobileChatOpen) {
            return (
                <div className="h-[calc(100vh-8rem)] flex flex-col border rounded-lg bg-background shadow-sm overflow-hidden">
                    {/* CHAT VIEW MOBILE */}
                    <div className="h-16 border-b flex items-center justify-between px-4 bg-card/50 backdrop-blur">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="-ml-2" onClick={() => setMobileChatOpen(false)}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <Avatar className="h-8 w-8 border-2 border-background">
                                <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                                <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-semibold text-sm">{selectedUser.name}</div>
                                <div className="flex items-center gap-1.5">
                                    <span className={cn(
                                        "h-2 w-2 rounded-full",
                                        selectedUser.status === 'online' ? "bg-green-500" :
                                            selectedUser.status === 'busy' ? "bg-red-500" : "bg-zinc-400"
                                    )} />
                                    <span className="text-xs text-muted-foreground capitalize">{selectedUser.status}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                                <Phone className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 p-4 bg-muted/10">
                        {renderMessages()}
                    </ScrollArea>

                    <ChatInput />
                </div>
            )
        }

        return (
            <div className="h-[calc(100vh-8rem)] flex flex-col border rounded-lg bg-background shadow-sm overflow-hidden">
                {/* LIST VIEW MOBILE */}
                <div className="p-4 border-b space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Messages</h2>
                        <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-8 bg-muted/50 border-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="flex flex-col p-2 gap-1">
                        {filteredUsers.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => handleUserSelect(user)}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg transition-colors text-left group relative hover:bg-muted/50"
                                )}
                            >
                                <div className="relative">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className={cn(
                                        "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                                        user.status === 'online' ? "bg-green-500" :
                                            user.status === 'busy' ? "bg-red-500" : "bg-zinc-400"
                                    )} />
                                </div>
                                <div className="flex-1 overflow-hidden min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <span className="font-semibold text-sm truncate">{user.name}</span>
                                        <span className="text-[10px] text-muted-foreground shrink-0">{user.lastMessageTime}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-0.5">
                                        <span className="text-xs text-muted-foreground truncate pr-2">
                                            {user.lastMessage}
                                        </span>
                                        {user.unreadCount && (
                                            <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                                                {user.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex-1 overflow-hidden border rounded-lg bg-background shadow-sm">
            <ResizablePanelGroup direction="horizontal">
                {/* LEFT SIDEBAR - CONTACT LIST */}
                <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className="min-w-[280px]">
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Messages</h2>
                                <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search..."
                                    className="pl-8 bg-muted/50 border-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="flex flex-col p-2 gap-1">
                                {filteredUsers.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => setSelectedUser(user)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg transition-colors text-left group relative",
                                            selectedUser?.id === user.id ? "bg-accent" : "hover:bg-muted/50"
                                        )}
                                    >
                                        <div className="relative">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className={cn(
                                                "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                                                user.status === 'online' ? "bg-green-500" :
                                                    user.status === 'busy' ? "bg-red-500" : "bg-zinc-400"
                                            )} />
                                        </div>
                                        <div className="flex-1 overflow-hidden min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <span className="font-semibold text-sm truncate">{user.name}</span>
                                                <span className="text-[10px] text-muted-foreground shrink-0">{user.lastMessageTime}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-0.5">
                                                <span className="text-xs text-muted-foreground truncate pr-2">
                                                    {user.lastMessage}
                                                </span>
                                                {user.unreadCount && (
                                                    <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                                                        {user.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* RIGHT AREA - CHAT WINDOW */}
                <ResizablePanel defaultSize={75}>
                    <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="h-16 border-b flex items-center justify-between px-6 bg-card/50 backdrop-blur">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border-2 border-background">
                                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                                    <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold text-sm">{selectedUser.name}</div>
                                    <div className="flex items-center gap-1.5">
                                        <span className={cn(
                                            "h-2 w-2 rounded-full",
                                            selectedUser.status === 'online' ? "bg-green-500" :
                                                selectedUser.status === 'busy' ? "bg-red-500" : "bg-zinc-400"
                                        )} />
                                        <span className="text-xs text-muted-foreground capitalize">{selectedUser.status}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                                    <Phone className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                                    <Video className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                                    <MoreVertical className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <ScrollArea className="flex-1 p-6 bg-muted/10">
                            {renderMessages()}
                        </ScrollArea>

                        {/* Input Area */}
                        <ChatInput />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
