"use client"

import * as React from "react"
import {
    FileText,
    Folder,
    MoreVertical,
    Plus,
    Search,
    Grid,
    List,
    Upload,
    ChevronRight,
    Clock,
    Star,
    Trash2,
    HardDrive,
    File,
    Image as ImageIcon,
    FolderPlus,
    ArrowLeft,
    Share2,
    Download,
    Info,
    Edit3
} from "lucide-react"
import { useFileStore, FileItem } from "@/store/use-file-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
    ToggleGroup,
    ToggleGroupItem
} from "@/components/ui/toggle-group"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function DrivePage() {
    const {
        items,
        currentParentId,
        viewMode,
        selectedIds,
        setCurrentParentId,
        setViewMode,
        toggleSelection,
        clearSelection,
        selectAll,
        createFolder,
        deleteItems,
        renameItem
    } = useFileStore()

    const [searchQuery, setSearchQuery] = React.useState("")
    const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = React.useState(false)
    const [isRenameDialogOpen, setIsRenameDialogOpen] = React.useState(false)
    const [itemName, setItemName] = React.useState("")
    const [targetItem, setTargetItem] = React.useState<FileItem | null>(null)

    // Filtering items for current view
    const currentItems = items.filter(item =>
        item.parentId === currentParentId &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Breadcrumbs
    const getBreadcrumbs = () => {
        const crumbs = []
        let currentId = currentParentId
        while (currentId) {
            const folder = items.find(i => i.id === currentId)
            if (folder) {
                crumbs.unshift(folder)
                currentId = folder.parentId
            } else {
                break
            }
        }
        return crumbs
    }

    const breadcrumbs = getBreadcrumbs()

    const formatSize = (bytes?: number) => {
        if (!bytes) return "--"
        const k = 1024
        if (bytes < k) return bytes + " B"
        const m = k * k
        if (bytes < m) return (bytes / k).toFixed(1) + " KB"
        const g = m * k
        if (bytes < g) return (bytes / m).toFixed(1) + " MB"
        return (bytes / g).toFixed(1) + " GB"
    }

    const getFileIcon = (item: FileItem) => {
        if (item.type === 'folder') return <Folder className="h-10 w-10 text-blue-500 fill-blue-500/20" />
        if (item.mimeType?.startsWith('image/')) return <ImageIcon className="h-10 w-10 text-purple-500" />
        if (item.mimeType === 'application/pdf') return <FileText className="h-10 w-10 text-rose-500" />
        return <File className="h-10 w-10 text-slate-400" />
    }

    const handleCreateFolder = () => {
        if (!itemName) return
        createFolder(itemName)
        setIsNewFolderDialogOpen(false)
        setItemName("")
        toast.success("Folder created")
    }

    const handleRename = () => {
        if (!targetItem || !itemName) return
        renameItem(targetItem.id, itemName)
        setIsRenameDialogOpen(false)
        setTargetItem(null)
        setItemName("")
        toast.success("Item renamed")
    }

    const handleDelete = (ids: string[]) => {
        deleteItems(ids)
        toast.error(`${ids.length} item(s) deleted`)
    }

    const handleItemClick = (e: React.MouseEvent, item: FileItem) => {
        if (e.ctrlKey || e.metaKey) {
            toggleSelection(item.id)
        } else {
            clearSelection()
            toggleSelection(item.id)
        }
    }

    const handleItemDoubleClick = (item: FileItem) => {
        if (item.type === 'folder') {
            setCurrentParentId(item.id)
        } else {
            toast.info(`Opening ${item.name}...`)
        }
    }

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden animate-in fade-in duration-500">
            {/* Drive Sidebar */}
            <aside className="w-64 border-r bg-muted/20 hidden lg:flex flex-col p-4 space-y-6">
                <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start text-primary bg-primary/10 font-semibold" onClick={() => setCurrentParentId(null)}>
                        <HardDrive className="mr-3 h-4 w-4" /> My Drive
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                        <Clock className="mr-3 h-4 w-4" /> Recent
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                        <Star className="mr-3 h-4 w-4" /> Starred
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                        <Trash2 className="mr-3 h-4 w-4" /> Trash
                    </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Storage</span>
                        <span className="text-xs font-medium">85% full</span>
                    </div>
                    <div className="px-2 space-y-2">
                        <Progress value={85} className="h-2 bg-muted" />
                        <p className="text-[10px] text-muted-foreground px-1">
                            12.8 GB of 15 GB used
                        </p>
                        <Button variant="outline" size="sm" className="w-full text-xs border-dashed border-primary/30 text-primary hover:bg-primary/5">
                            Buy Storage
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-background">
                {/* Drive Top Bar */}
                <header className="p-4 border-b flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Button variant="ghost" size="icon" onClick={() => {
                            if (currentParentId) {
                                const current = items.find(i => i.id === currentParentId)
                                setCurrentParentId(current?.parentId || null)
                            }
                        }} disabled={!currentParentId}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <nav className="flex items-center text-sm font-medium whitespace-nowrap overflow-hidden">
                            <span
                                className="cursor-pointer hover:text-primary transition-colors px-1"
                                onClick={() => setCurrentParentId(null)}
                            >
                                My Drive
                            </span>
                            {breadcrumbs.map((crumb) => (
                                <React.Fragment key={crumb.id}>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    <span
                                        className="cursor-pointer hover:text-primary transition-colors px-1"
                                        onClick={() => setCurrentParentId(crumb.id)}
                                    >
                                        {crumb.name}
                                    </span>
                                </React.Fragment>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search drive..."
                                className="pl-9 w-64 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as any)}>
                            <ToggleGroupItem value="grid" aria-label="Grid view">
                                <Grid className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="list" aria-label="List view">
                                <List className="h-4 w-4" />
                            </ToggleGroupItem>
                        </ToggleGroup>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                    <Plus className="mr-2 h-4 w-4" /> New
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem onClick={() => setIsNewFolderDialogOpen(true)}>
                                    <FolderPlus className="mr-2 h-4 w-4" /> New Folder
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => toast.success("Upload simulation started...")}>
                                    <Upload className="mr-2 h-4 w-4" /> File Upload
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Folder className="mr-2 h-4 w-4" /> Folder Upload
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Selection Toolbar (Visible when items selected) */}
                {selectedIds.length > 0 && (
                    <div className="p-2 px-4 bg-primary/10 border-b flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-4">
                            <Badge variant="secondary" className="bg-primary/20 text-primary border-none">
                                {selectedIds.length} selected
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={clearSelection} className="h-8 text-xs">Clear</Button>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" title="Share">
                                <Share2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" title="Download">
                                <Download className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50/50"
                                title="Delete"
                                onClick={() => handleDelete(selectedIds)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Explorer Content */}
                <div className="flex-1 overflow-auto p-4 custom-scrollbar" onClick={clearSelection}>
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4" onClick={(e) => e.stopPropagation()}>
                            {currentItems.map((item) => (
                                <ContextMenu key={item.id}>
                                    <ContextMenuTrigger>
                                        <div
                                            className={cn(
                                                "group flex flex-col items-center p-4 rounded-xl transition-all border border-transparent cursor-pointer",
                                                selectedIds.includes(item.id)
                                                    ? "bg-primary/10 border-primary/20 shadow-sm shadow-primary/5"
                                                    : "hover:bg-muted/50 hover:border-muted-foreground/10"
                                            )}
                                            onClick={(e) => handleItemClick(e, item)}
                                            onDoubleClick={() => handleItemDoubleClick(item)}
                                        >
                                            <div className="mb-3 relative transition-transform group-active:scale-95 duration-200">
                                                {getFileIcon(item)}
                                                {selectedIds.includes(item.id) && (
                                                    <div className="absolute -top-1 -right-1 bg-primary text-white p-0.5 rounded-full ring-2 ring-background">
                                                        <Check className="h-2 w-2" />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs font-semibold text-center truncate w-full group-hover:text-primary transition-colors">
                                                {item.name}
                                            </span>
                                            {item.type === 'file' && (
                                                <span className="text-[10px] text-muted-foreground mt-0.5">
                                                    {formatSize(item.size)}
                                                </span>
                                            )}
                                        </div>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent className="w-56">
                                        <ContextMenuItem onClick={() => handleItemDoubleClick(item)} className="font-semibold">
                                            <OpenInNewWindowIcon className="mr-2 h-4 w-4" /> Open
                                        </ContextMenuItem>
                                        <ContextMenuSeparator />
                                        <ContextMenuItem>
                                            <Share2 className="mr-2 h-4 w-4" /> Share
                                        </ContextMenuItem>
                                        <ContextMenuItem>
                                            <Download className="mr-2 h-4 w-4" /> Download
                                        </ContextMenuItem>
                                        <ContextMenuSeparator />
                                        <ContextMenuItem onClick={() => {
                                            setTargetItem(item)
                                            setItemName(item.name)
                                            setIsRenameDialogOpen(true)
                                        }}>
                                            <Edit3 className="mr-2 h-4 w-4" /> Rename
                                        </ContextMenuItem>
                                        <ContextMenuItem onClick={() => handleDelete([item.id])} className="text-rose-500 focus:text-rose-500">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </ContextMenuItem>
                                    </ContextMenuContent>
                                </ContextMenu>
                            ))}
                        </div>
                    ) : (
                        <div className="border rounded-xl overflow-hidden bg-muted/10" onClick={(e) => e.stopPropagation()}>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 text-muted-foreground border-b font-semibold">
                                    <tr>
                                        <th className="p-4 w-10">
                                            <div
                                                className="w-4 h-4 rounded border flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                                                onClick={() => selectedIds.length === currentItems.length ? clearSelection() : selectAll(currentItems.map(i => i.id))}
                                            >
                                                {selectedIds.length === currentItems.length && currentItems.length > 0 && <Check className="h-3 w-3 text-primary" />}
                                            </div>
                                        </th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Last Modified</th>
                                        <th className="p-4">Size</th>
                                        <th className="p-4 w-10 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-muted/50">
                                    {currentItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            className={cn(
                                                "group transition-colors cursor-pointer",
                                                selectedIds.includes(item.id) ? "bg-primary/5" : "hover:bg-muted/30"
                                            )}
                                            onClick={(e) => handleItemClick(e, item)}
                                            onDoubleClick={() => handleItemDoubleClick(item)}
                                        >
                                            <td className="p-4">
                                                <div
                                                    className={cn(
                                                        "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                                        selectedIds.includes(item.id) ? "border-primary bg-primary" : "group-hover:border-primary/50"
                                                    )}
                                                >
                                                    {selectedIds.includes(item.id) && <Check className="h-3 w-3 text-white" />}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="shrink-0">
                                                        {item.type === 'folder' ? <Folder className="h-5 w-5 text-blue-500 fill-blue-500/20" /> : <File className="h-5 w-5 text-slate-400" />}
                                                    </div>
                                                    <span className="font-semibold group-hover:text-primary transition-colors">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-muted-foreground whitespace-nowrap">
                                                {new Date(item.updatedAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {item.type === 'file' ? formatSize(item.size) : '--'}
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {currentItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                            <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center">
                                <Folder className="h-10 w-10 text-muted-foreground/30" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-muted-foreground">No items found</p>
                                <p className="text-sm text-muted-foreground">This folder is empty or no matches were found.</p>
                            </div>
                            <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(true)} className="mt-4">
                                <Plus className="mr-2 h-4 w-4" /> Create Folder
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            {/* Dialogs */}
            <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>New Folder</DialogTitle>
                        <DialogDescription>
                            Enter a name for your new folder.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="folder-name" className="text-right">Name</Label>
                        <Input
                            id="folder-name"
                            className="col-span-3 mt-2"
                            autoFocus
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsNewFolderDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateFolder}>Create Folder</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Rename Item</DialogTitle>
                        <DialogDescription>
                            Enter a new name for "{targetItem?.name}".
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="rename-name" className="text-right">New Name</Label>
                        <Input
                            id="rename-name"
                            className="col-span-3 mt-2"
                            autoFocus
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsRenameDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleRename}>Rename</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Internal Icons/Helpers
function Check({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}

function OpenInNewWindowIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
    )
}
