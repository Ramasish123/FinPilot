import { create } from 'zustand';

export interface AppNotification {
  id: string;
  title: string;
  time: string;
  read: boolean;
}

interface NotificationStore {
  notifications: AppNotification[];
  addNotification: (title: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [
    {
      id: "initial-1",
      title: "New login detected on your account",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    }
  ],
  addNotification: (title) => set((state) => ({
    notifications: [{
      id: Date.now().toString(),
      title,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    }, ...state.notifications]
  })),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),
  clearNotifications: () => set({ notifications: [] })
}));
