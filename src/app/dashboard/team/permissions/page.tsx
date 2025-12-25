"use client"

import * as React from "react"
import {
    ShieldCheck,
    Settings,
    Users,
    MessageSquare,
    Database,
    Lock,
    Save,
    Info,
    ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type Role = 'Admin' | 'Member' | 'Guest'

interface Permission {
    id: string
    label: string
    description: string
    category: string
}

const permissions: Permission[] = [
    { id: 'view_dashboard', label: 'View Dashboard', description: 'Access to the main dashboard overview.', category: 'General' },
    { id: 'manage_team', label: 'Manage Team', description: 'Invite, edit, and remove team members.', category: 'Team Management' },
    { id: 'edit_roles', label: 'Edit Roles', description: 'Modify permissions for different roles.', category: 'Team Management' },
    { id: 'view_chat', label: 'Access Chat', description: 'Ability to participate in team conversations.', category: 'Communication' },
    { id: 'delete_messages', label: 'Delete Messages', description: 'Remove messages from any conversation.', category: 'Communication' },
    { id: 'export_data', label: 'Export Data', description: 'Download analytics and team reports.', category: 'System' },
    { id: 'billing_access', label: 'Billing Access', description: 'Manage subscriptions and payment methods.', category: 'System' },
]

export default function PermissionsPage() {
    const [activeRole, setActiveRole] = React.useState<Role>('Admin')
    const [rolePermissions, setRolePermissions] = React.useState<Record<Role, string[]>>({
        Admin: ['view_dashboard', 'manage_team', 'edit_roles', 'view_chat', 'delete_messages', 'export_data', 'billing_access'],
        Member: ['view_dashboard', 'view_chat'],
        Guest: ['view_chat'],
    })

    const handleToggle = (permId: string) => {
        setRolePermissions(prev => {
            const currentPerms = prev[activeRole]
            const updatedPerms = currentPerms.includes(permId)
                ? currentPerms.filter(id => id !== permId)
                : [...currentPerms, permId]

            return { ...prev, [activeRole]: updatedPerms }
        })
    }

    const handleSave = () => {
        toast.success(`${activeRole} permissions updated successfully`)
    }

    const categories = Array.from(new Set(permissions.map(p => p.category)))

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Lock className="h-6 w-6 text-primary" />
                        <h1 className="text-3xl font-bold tracking-tight">Role Permissions</h1>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Configure access levels and capabilities for each team role.
                    </p>
                </div>
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 min-w-[120px]">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="Admin" className="w-full" onValueChange={(v) => setActiveRole(v as Role)}>
                <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl border h-14">
                    <TabsTrigger value="Admin" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-base py-2">
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Admin
                    </TabsTrigger>
                    <TabsTrigger value="Member" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-base py-2">
                        <Users className="h-4 w-4 mr-2" />
                        Member
                    </TabsTrigger>
                    <TabsTrigger value="Guest" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-base py-2">
                        <Settings className="h-4 w-4 mr-2" />
                        Guest
                    </TabsTrigger>
                </TabsList>

                <div className="mt-8 space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <Info className="h-5 w-5 text-primary" />
                        <p className="text-sm text-primary/80">
                            Changes applied here will affect all users currently assigned the <span className="font-bold">{activeRole}</span> role.
                        </p>
                    </div>

                    <Accordion type="multiple" defaultValue={categories} className="space-y-4">
                        {categories.map((category) => (
                            <AccordionItem key={category} value={category} className="border rounded-xl bg-card/30 backdrop-blur-sm overflow-hidden px-1">
                                <AccordionTrigger className="hover:no-underline py-4 px-4 font-semibold text-lg hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        {category === 'General' && <Lock className="h-5 w-5 text-blue-500" />}
                                        {category === 'Team Management' && <Users className="h-5 w-5 text-purple-500" />}
                                        {category === 'Communication' && <MessageSquare className="h-5 w-5 text-green-500" />}
                                        {category === 'System' && <Database className="h-5 w-5 text-amber-500" />}
                                        {category}
                                        <Badge variant="outline" className="ml-2 font-normal">
                                            {permissions.filter(p => p.category === category).length} Actions
                                        </Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-4 pt-0">
                                    <div className="divide-y divide-border/50">
                                        {permissions
                                            .filter(p => p.category === category)
                                            .map((perm) => (
                                                <div key={perm.id} className="flex items-center justify-between py-4 group first:pt-2">
                                                    <div className="space-y-0.5">
                                                        <label
                                                            htmlFor={perm.id}
                                                            className="text-base font-medium cursor-pointer flex items-center gap-2 group-hover:text-primary transition-colors"
                                                        >
                                                            {perm.label}
                                                        </label>
                                                        <p className="text-sm text-muted-foreground max-w-md">
                                                            {perm.description}
                                                        </p>
                                                    </div>
                                                    <Switch
                                                        id={perm.id}
                                                        checked={rolePermissions[activeRole].includes(perm.id)}
                                                        onCheckedChange={() => handleToggle(perm.id)}
                                                        className="data-[state=checked]:bg-primary"
                                                    />
                                                </div>
                                            ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </Tabs>

            <div className="flex items-center justify-between p-6 rounded-2xl border bg-gradient-to-r from-muted/50 to-transparent">
                <div className="space-y-1">
                    <h3 className="font-semibold text-xl">Need custom roles?</h3>
                    <p className="text-muted-foreground">
                        Upgrade to the Enterprise plan to create unlimited custom roles with granular permissions.
                    </p>
                </div>
                <Button variant="outline" className="border-primary/20 hover:border-primary/50 text-primary">
                    View Plans
                </Button>
            </div>
        </div>
    )
}
