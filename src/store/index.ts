import { Invoice, InvoiceItemCreation } from "@/types";
import { generateUuid } from "@/utils/uuid";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

type InvoiceStore = {
  invoice: Invoice;
  updateField: (field: keyof Invoice, value: string | number | null) => void;
  updateItem: (
    index: number,
    field: keyof InvoiceItemCreation,
    value: string | number
  ) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  setInvoice: (invoice: Invoice) => void;
  clearInvoice: () => void;
};

const BLANK_INVOICE: Invoice = {
  id: generateUuid(),
  logo: null,
  fullName: "",
  role: "",
  billToCompany: "",
  billToAddress: "",
  billToZip: "",
  invoiceNumber: "INV-DRAFT",
  invoiceDate: new Date().toISOString().slice(0, 10),
  dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15)
    .toISOString()
    .slice(0, 10),
  items: [{ description: "Consulting services", quantity: 1, amount: 0 }],
  taxRate: 0,
  notes: "Payment due within 15 days.",
  payVia: "Bank Transfer",
  accountName: "",
  accountEmail: "",
};

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    devtools(
      (set) => ({
        invoice: BLANK_INVOICE,

        setInvoice: (invoice) => set({ invoice }),

        clearInvoice: () => set({ invoice: BLANK_INVOICE }),

        updateField: (field, value) =>
          set((state) => ({
            invoice: { ...state.invoice, [field]: value },
          })),

        updateItem: (index, field, value) =>
          set((state) => {
            const newItems = [...state.invoice.items];
            newItems[index] = {
              ...newItems[index],
              [field]: value,
            } as InvoiceItemCreation & { amount: number };
            return { invoice: { ...state.invoice, items: newItems } };
          }),

        addItem: () =>
          set((state) => ({
            invoice: {
              ...state.invoice,
              items: [
                ...state.invoice.items,
                { description: "New Item", quantity: 1, amount: 0 },
              ],
            },
          })),

        removeItem: (index) =>
          set((state) => ({
            invoice: {
              ...state.invoice,
              items: state.invoice.items.filter((_, i) => i !== index),
            },
          })),
      }),
      { name: "InvoiceStore" }
    ),
    {
      name: "invoice-storage",
      partialize: (state) => ({ invoice: state.invoice }),
    }
  )
);
