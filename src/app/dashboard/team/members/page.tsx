"use client"

import * as React from "react"
import {
    Plus,
    Search,
    MoreHorizontal,
    UserPlus,
    Mail,
    Shield,
    Trash2,
    Edit2,
    Filter,
    CheckCircle2,
    Clock,
    XCircle
} from "lucide-react"
import Link from "next/link"
import { useTeamStore, TeamMember, TeamRole, TeamStatus } from "@/store/use-team-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function TeamPage() {
    const { members, addMember, updateMember, deleteMember } = useTeamStore()
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [editingMember, setEditingMember] = React.useState<TeamMember | null>(null)

    // Form State
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        role: "Member" as TeamRole,
        status: "Active" as TeamStatus,
    })

    // Filtered members
    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleOpenDialog = (member?: TeamMember) => {
        if (member) {
            setEditingMember(member)
            setFormData({
                name: member.name,
                email: member.email,
                role: member.role,
                status: member.status,
            })
        } else {
            setEditingMember(null)
            setFormData({
                name: "",
                email: "",
                role: "Member",
                status: "Active",
            })
        }
        setIsDialogOpen(true)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.email) {
            toast.error("Please fill in all fields")
            return
        }

        if (editingMember) {
            updateMember(editingMember.id, formData)
            toast.success("Member updated successfully")
        } else {
            addMember(formData)
            toast.success("Member added successfully")
        }

        setIsDialogOpen(false)
    }

    const handleDelete = (id: string) => {
        deleteMember(id)
        toast.success("Member deleted successfully")
    }

    const getStatusIcon = (status: TeamStatus) => {
        switch (status) {
            case 'Active': return <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
            case 'Pending': return <Clock className="h-3 w-3 mr-1 text-amber-500" />
            case 'Inactive': return <XCircle className="h-3 w-3 mr-1 text-rose-500" />
        }
    }

    const getRoleBadgeColor = (role: TeamRole) => {
        switch (role) {
            case 'Owner': return "bg-purple-500/10 text-purple-500 border-purple-500/20"
            case 'Admin': return "bg-blue-500/10 text-blue-500 border-blue-500/20"
            case 'Member': return "bg-slate-500/10 text-slate-500 border-slate-500/20"
            case 'Guest': return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
        }
    }

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your team members and their account permissions.
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                </Button>
            </div>

            <div className="flex items-center gap-4 bg-card/50 p-4 rounded-xl border backdrop-blur-sm">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search members..."
                        className="pl-9 bg-background/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="icon" className="shrink-0 border-none bg-background/50">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            <div className="rounded-xl border bg-card/30 backdrop-blur-sm overflow-hidden overflow-x-auto shadow-xl shadow-black/5">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[300px]">Member</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMembers.map((member) => (
                            <TableRow key={member.id} className="group hover:bg-muted/30 transition-colors">
                                <TableCell>
                                    <Link href={`/dashboard/team/members/${member.id}`} className="flex items-center gap-3 group/member">
                                        <Avatar className="h-10 w-10 border-2 border-background shadow-sm transition-transform group-hover/member:scale-105">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                {member.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm group-hover/member:text-primary transition-colors underline-offset-4 group-hover/member:underline">{member.name}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Mail className="h-3 w-3" /> {member.email}
                                            </span>
                                        </div>
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={cn("font-medium px-2.5 py-0.5", getRoleBadgeColor(member.role))}>
                                        <Shield className="h-3 w-3 mr-1" />
                                        {member.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center text-sm font-medium">
                                        {getStatusIcon(member.status)}
                                        {member.status}
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {new Date(member.joinedAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-full">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40 animate-in fade-in zoom-in duration-200">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleOpenDialog(member)} className="cursor-pointer">
                                                <Edit2 className="h-4 w-4 mr-2 text-blue-500" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(member.id)} className="cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-500/10">
                                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredMembers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                    No team members found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            {editingMember ? "Edit Member" : "Add Team Member"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingMember
                                ? "Update member details and permissions."
                                : "Invite a new member to your team."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <UserPlus className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    className="pl-9"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    className="pl-9"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(v: TeamRole) => setFormData({ ...formData, role: v })}
                                >
                                    <SelectTrigger className="bg-background">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Owner">Owner</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="Member">Member</SelectItem>
                                        <SelectItem value="Guest">Guest</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(v: TeamStatus) => setFormData({ ...formData, status: v })}
                                >
                                    <SelectTrigger className="bg-background">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="pt-4 gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-primary hover:bg-primary/90 min-w-[100px]">
                                {editingMember ? "Save Changes" : "Invite Member"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
