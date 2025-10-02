"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type GuestNameState = {
  name: string;
  setName: (name: string) => void;
  clear: () => void;
};

export const useGuestName = create<GuestNameState>()(
  persist(
    (set) => ({
      name: "",
      setName: (name: string) => set({ name: name.trim() }),
      clear: () => set({ name: "" }),
    }),
    {
      name: "guestname",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ name: state.name }),
    },
  ),
);
