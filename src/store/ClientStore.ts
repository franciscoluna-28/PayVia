import { Client } from "@/types";
import { generateUuid } from "@/utils/uuid";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export type ClientStore = {
  clients: Client[];
  addClient: (client: Omit<Client, "id">) => void;
  removeClient: (id: string) => void;
  updateClient: (id: string, clientData: Partial<Client>) => void;
};

// Example client template for initial state
const INITIAL_CLIENTS: Client[] = [
  {
    id: generateUuid(),
    fullName: "Acme Corporation",
    address: "123 Main Street",
    zip: "12345",
  },
];

export const useClientStore = create<ClientStore>()(
  persist(
    devtools(
      (set) => ({
        clients: INITIAL_CLIENTS, // Load initial/example data

        addClient: (clientData) =>
          set((state) => ({
            clients: [
              ...state.clients,
              { ...clientData, id: generateUuid() } as Client,
            ],
          })),

        removeClient: (id) =>
          set((state) => ({
            clients: state.clients.filter((c) => c.id !== id),
          })),

        updateClient: (id, clientData) =>
          set((state) => ({
            clients: state.clients.map((c) =>
              c.id === id ? { ...c, ...clientData } : c
            ),
          })),
      }),
      { name: "ClientStore" }
    ),
    {
      name: "client-storage", // Stored in IndexedDB/Local Storage
    }
  )
);

export default useClientStore;
