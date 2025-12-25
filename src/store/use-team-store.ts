import { create } from 'zustand'

export type TeamRole = 'Admin' | 'Member' | 'Guest' | 'Owner'
export type TeamStatus = 'Active' | 'Inactive' | 'Pending'

export interface TeamMember {
    id: string
    name: string
    email: string
    role: TeamRole
    status: TeamStatus
    avatar?: string
    joinedAt: string
}

interface TeamStore {
    members: TeamMember[]
    addMember: (member: Omit<TeamMember, 'id' | 'joinedAt'>) => void
    updateMember: (id: string, member: Partial<TeamMember>) => void
    deleteMember: (id: string) => void
}

export const useTeamStore = create<TeamStore>((set) => ({
    members: [
        {
            id: '1',
            name: 'Alice Smith',
            email: 'alice@example.com',
            role: 'Owner',
            status: 'Active',
            avatar: 'https://i.pravatar.cc/150?u=1',
            joinedAt: '2024-01-15',
        },
        {
            id: '2',
            name: 'Bob Jones',
            email: 'bob@example.com',
            role: 'Admin',
            status: 'Active',
            avatar: 'https://i.pravatar.cc/150?u=2',
            joinedAt: '2024-02-20',
        },
        {
            id: '3',
            name: 'Charlie Brown',
            email: 'charlie@example.com',
            role: 'Member',
            status: 'Pending',
            avatar: 'https://i.pravatar.cc/150?u=3',
            joinedAt: '2024-03-05',
        },
    ],
    addMember: (member) => set((state) => ({
        members: [
            ...state.members,
            {
                ...member,
                id: Math.random().toString(36).substring(7),
                joinedAt: new Date().toISOString().split('T')[0],
            },
        ],
    })),
    updateMember: (id, updatedMember) => set((state) => ({
        members: state.members.map((m) => (m.id === id ? { ...m, ...updatedMember } : m)),
    })),
    deleteMember: (id) => set((state) => ({
        members: state.members.filter((m) => m.id !== id),
    })),
}))
