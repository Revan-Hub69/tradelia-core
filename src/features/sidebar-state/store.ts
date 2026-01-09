import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  (set, get) => ({
    isOpen: false,
    setOpen: (isOpen) => set({ isOpen }),
    toggle: () => set({ isOpen: !get().isOpen }),
  })
);