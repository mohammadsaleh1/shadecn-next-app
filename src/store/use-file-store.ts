import { create } from 'zustand'

export type FileType = "file" | "folder"

export interface FileItem {
    id: string
    name: string
    type: FileType
    size?: number
    mimeType?: string
    parentId: string | null
    createdAt: string
    updatedAt: string
}

interface FileStore {
    items: FileItem[]
    currentParentId: string | null
    viewMode: 'grid' | 'list'
    selectedIds: string[]

    // Actions
    setCurrentParentId: (id: string | null) => void
    setViewMode: (mode: 'grid' | 'list') => void
    toggleSelection: (id: string) => void
    clearSelection: () => void
    selectAll: (ids: string[]) => void

    createFolder: (name: string) => void
    deleteItems: (ids: string[]) => void
    renameItem: (id: string, newName: string) => void
}

const initialItems: FileItem[] = [
    { id: '1', name: 'Work', type: 'folder', parentId: null, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: '2', name: 'Personal', type: 'folder', parentId: null, createdAt: '2024-01-02', updatedAt: '2024-01-02' },
    { id: '3', name: 'Resume.pdf', type: 'file', size: 1024 * 1024 * 2.5, mimeType: 'application/pdf', parentId: null, createdAt: '2024-01-03', updatedAt: '2024-01-03' },
    { id: '4', name: 'Project Phase 1', type: 'folder', parentId: '1', createdAt: '2024-01-04', updatedAt: '2024-01-04' },
    { id: '5', name: 'Budget.xlsx', type: 'file', size: 1024 * 512, mimeType: 'application/vnd.ms-excel', parentId: '1', createdAt: '2024-01-05', updatedAt: '2024-01-05' },
    { id: '6', name: 'Vacation.jpg', type: 'file', size: 1024 * 1024 * 4.2, mimeType: 'image/jpeg', parentId: '2', createdAt: '2024-01-06', updatedAt: '2024-01-06' },
]

export const useFileStore = create<FileStore>((set) => ({
    items: initialItems,
    currentParentId: null,
    viewMode: 'grid',
    selectedIds: [],

    setCurrentParentId: (id) => set({ currentParentId: id, selectedIds: [] }),
    setViewMode: (mode) => set({ viewMode: mode }),

    toggleSelection: (id) => set((state) => ({
        selectedIds: state.selectedIds.includes(id)
            ? state.selectedIds.filter(sid => sid !== id)
            : [...state.selectedIds, id]
    })),

    clearSelection: () => set({ selectedIds: [] }),
    selectAll: (ids) => set({ selectedIds: ids }),

    createFolder: (name) => set((state) => ({
        items: [...state.items, {
            id: Math.random().toString(36).substring(7),
            name,
            type: 'folder',
            parentId: state.currentParentId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }]
    })),

    deleteItems: (ids) => set((state) => ({
        items: state.items.filter(item => !ids.includes(item.id)),
        selectedIds: state.selectedIds.filter(id => !ids.includes(id))
    })),

    renameItem: (id, newName) => set((state) => ({
        items: state.items.map(item => item.id === id ? { ...item, name: newName, updatedAt: new Date().toISOString() } : item)
    }))
}))
