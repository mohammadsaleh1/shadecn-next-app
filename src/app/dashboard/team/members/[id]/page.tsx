"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import {
    ArrowLeft,
    Mail,
    Shield,
    Clock,
    Calendar,
    MessageSquare,
    MoreVertical,
    Edit2,
    Trash2,
    MapPin,
    Briefcase,
    Twitter,
    Github,
    Linkedin,
    CheckCircle2,
    XCircle,
    FileText,
    Activity,
    Lock,
    ExternalLink,
    Plus
} from "lucide-react"
import { useTeamStore, TeamRole, TeamStatus } from "@/store/use-team-store"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function MemberProfilePage() {
    const { id } = useParams()
    const router = useRouter()
    const { members, deleteMember } = useTeamStore()

    const member = members.find(m => m.id === id)

    if (!member) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
                <h1 className="text-2xl font-bold">Member not found</h1>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    const handleDelete = () => {
        deleteMember(member.id)
        toast.success("Member deleted")
        router.push("/dashboard/team/members")
    }

    const getRoleBadgeColor = (role: TeamRole) => {
        switch (role) {
            case 'Owner': return "bg-purple-500/10 text-purple-500 border-purple-500/20"
            case 'Admin': return "bg-blue-500/10 text-blue-500 border-blue-500/20"
            case 'Member': return "bg-slate-500/10 text-slate-500 border-slate-500/20"
            case 'Guest': return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
        }
    }

    const getStatusIcon = (status: TeamStatus) => {
        switch (status) {
            case 'Active': return <CheckCircle2 className="h-4 w-4 mr-1.5 text-green-500" />
            case 'Pending': return <Clock className="h-4 w-4 mr-1.5 text-amber-500" />
            case 'Inactive': return <XCircle className="h-4 w-4 mr-1.5 text-rose-500" />
        }
    }

    return (
        <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full lg:max-w-7xl mx-auto">
            {/* Top Navigation */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()} className="group hover:bg-transparent px-0">
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold">Team Directory</span>
                </Button>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9 px-4">
                        <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 border">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-rose-500 focus:text-rose-500 focus:bg-rose-50" onClick={handleDelete}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Member
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Hero Header Section */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/10 to-blue-500/20 rounded-3xl blur-xl opacity-50 transition duration-1000 group-hover:opacity-70" />
                <Card className="relative border shadow-none rounded-3xl overflow-hidden bg-background/60 backdrop-blur-xl">
                    <CardContent className="pt-8 pb-8 px-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            <div className="relative">
                                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background ring-1 ring-border shadow-2xl">
                                    <AvatarImage src={member.avatar} />
                                    <AvatarFallback className="text-4xl bg-primary/10 text-primary font-bold">{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-2 right-4 bg-background border shadow-md rounded-full p-2">
                                    {getStatusIcon(member.status)}
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 text-center md:text-left pt-4">
                                <div className="space-y-1">
                                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{member.name}</h1>
                                    <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
                                        <Briefcase className="h-4 w-4" /> {member.role === 'Owner' ? 'Founder & CEO' : 'Senior Product Designer'}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <Badge variant="outline" className={cn("text-xs py-1 px-3 rounded-full border-2", getRoleBadgeColor(member.role))}>
                                        <Shield className="h-3 w-3 mr-1.5" /> {member.role}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs py-1 px-3 rounded-full">
                                        <MapPin className="h-3 w-3 mr-1.5" /> London, UK
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs py-1 px-3 rounded-full">
                                        <Calendar className="h-3 w-3 mr-1.5" /> Joined {new Date(member.joinedAt).getFullYear()}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                                    <Button className="rounded-full px-6 shadow-lg shadow-primary/20">
                                        <MessageSquare className="h-4 w-4 mr-2" /> Message
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:text-primary transition-colors">
                                            <Twitter className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:text-primary transition-colors">
                                            <Github className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:text-primary transition-colors">
                                            <Linkedin className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Tabs Section */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-muted/50 p-1 border h-auto rounded-2xl">
                    <TabsTrigger value="overview" className="px-8 py-2.5 rounded-xl data-[state=active]:shadow-md">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="px-8 py-2.5 rounded-xl data-[state=active]:shadow-md">
                        Activity
                    </TabsTrigger>
                    <TabsTrigger value="data" className="px-8 py-2.5 rounded-xl data-[state=active]:shadow-md">
                        User Data
                    </TabsTrigger>
                    <TabsTrigger value="permissions" className="px-8 py-2.5 rounded-xl data-[state=active]:shadow-md">
                        Permissions
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2 border-muted/50">
                            <CardHeader>
                                <CardTitle>Biography</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-muted-foreground leading-relaxed text-lg">
                                    Passionate designer and developer with over 8 years of experience in creating digital products that people love.
                                    Specializing in UX strategy and high-fidelity prototyping, {member.name.split(' ')[0]} has been a key driver in
                                    our recent design system overhaul.
                                </p>

                                <div className="space-y-4">
                                    <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Expertise</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['Next.js', 'React Native', 'Figma', 'System Architecture', 'UI/UX Design', 'TypeScript'].map(skill => (
                                            <Badge key={skill} variant="secondary" className="px-3 py-1 bg-muted/30 border-none transition-colors hover:bg-muted font-medium">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-muted/50">
                            <CardHeader>
                                <CardTitle>Contact Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Email</label>
                                    <p className="font-semibold flex items-center gap-2 text-primary underline underline-offset-4 cursor-pointer">
                                        {member.email} <ExternalLink className="h-3 w-3" />
                                    </p>
                                </div>
                                <Separator className="opacity-50" />
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Phone</label>
                                    <p className="font-semibold">+1 (555) 123-4567</p>
                                </div>
                                <Separator className="opacity-50" />
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Office</label>
                                    <p className="font-semibold">Tower B, Level 15</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="activity" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="border-muted/50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-primary" />
                                    Recent Activity
                                </CardTitle>
                                <CardDescription>Chronological log of member actions and events.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">Download Log</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted-foreground/20 before:to-transparent">
                                {[
                                    { title: "Uploaded New Files", detail: "Added 3 design assets to the Drive", time: "2 hours ago", icon: FileText, color: "bg-blue-500", iconColor: "text-white" },
                                    { title: "Edited Role Permissions", detail: "Updated access levels for Guest users", time: "Yesterday at 4:32 PM", icon: Lock, color: "bg-purple-500", iconColor: "text-white" },
                                    { title: "Logged into System", detail: "Signed in from San Francisco, CA", time: "2 days ago", icon: Activity, color: "bg-green-500", iconColor: "text-white" },
                                    { title: "Created New Team", detail: "Initialized the 'Alpha Operations' workspace", time: "1 week ago", icon: Plus, color: "bg-amber-500", iconColor: "text-white" }
                                ].map((event, i) => (
                                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border bg-background shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                            <event.icon className={cn("h-4 w-4", event.color.replace('bg-', 'text-'))} />
                                        </div>
                                        <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 shadow-none bg-muted/20 border-muted group-hover:border-primary/20 transition-colors">
                                            <div className="flex items-center justify-between space-x-2 mb-1">
                                                <div className="font-bold">{event.title}</div>
                                                <time className="text-xs text-muted-foreground whitespace-nowrap">{event.time}</time>
                                            </div>
                                            <div className="text-sm text-muted-foreground">{event.detail}</div>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="data" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="border-muted/50">
                        <CardHeader>
                            <CardTitle>User Data & Assets</CardTitle>
                            <CardDescription>Files and resources associated with this member account.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { name: "Portfolio_2024.pdf", size: "2.4 MB", type: "pdf" },
                                    { name: "Avatar_Main.png", size: "842 KB", type: "img" },
                                    { name: "Project_Spec.docx", size: "1.1 MB", type: "doc" },
                                    { name: "Shared_Assets.zip", size: "15.7 MB", type: "zip" }
                                ].map(file => (
                                    <div key={file.name} className="flex items-center gap-3 p-3 rounded-xl border bg-muted/10 group cursor-pointer hover:bg-muted/30 transition-all">
                                        <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center border shadow-sm group-hover:border-primary/20">
                                            <FileText className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{file.name}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-medium">{file.size}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full border-dashed py-6 text-muted-foreground hover:text-primary hover:border-primary gap-2">
                                <Plus className="h-4 w-4" /> Request Data Export
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="permissions" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="border-muted/50 overflow-hidden">
                        <div className="bg-primary/5 px-6 py-4 flex items-center gap-4 border-b">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold">Effective Access Level: {member.role}</h3>
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-tight">Policies applied from system defaults</p>
                            </div>
                        </div>
                        <CardContent className="divide-y p-0">
                            {[
                                { title: "Dashboard Access", desc: "View analytics and general project overview.", status: true },
                                { title: "Invite Collaborators", desc: "Ability to add new members to the team.", status: member.role !== 'Guest' },
                                { title: "System Configuration", desc: "Modify API keys and environment settings.", status: member.role === 'Owner' || member.role === 'Admin' },
                                { title: "Billing & Subscriptions", desc: "Control payment methods and plans.", status: member.role === 'Owner' }
                            ].map((perm, i) => (
                                <div key={i} className="flex items-center justify-between p-6 hover:bg-muted/10 transition-colors">
                                    <div className="space-y-1">
                                        <p className="font-bold">{perm.title}</p>
                                        <p className="text-sm text-muted-foreground">{perm.desc}</p>
                                    </div>
                                    <Badge variant={perm.status ? "default" : "secondary"} className={cn("px-4", perm.status ? "bg-green-500 hover:bg-green-500" : "opacity-30")}>
                                        {perm.status ? "Authorized" : "Blocked"}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

// Re-using common components
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
