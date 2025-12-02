import { useInvoiceStore } from "@/store/InvoiceStore";
import { generatePdf } from "@/utils/pdf";
import { useTransition } from "react";

export const useInvoiceActions = () => {
  const store = useInvoiceStore();

  const [isPending, startTransition] = useTransition();

  const subtotal = store.invoice.items.reduce(
    (sum, item) => sum + item.amount * item.quantity,
    0
  );
  const tax = (subtotal * (store.invoice.taxRate || 0)) / 100;
  const total = subtotal + tax;

  const handleGeneratePdf = async () => {
    generatePdf({
      elementToPrintId: "invoice",
      fileName: "invoice.pdf",
    });
  };

  const downloadInvoiceAsPdf = () => {
    startTransition(async () => {
      await handleGeneratePdf();
    });
  };

  return {
    invoice: store.invoice,
    subtotal,
    tax,
    total,
    updateField: store.updateField,
    updateItem: store.updateItem,
    addItem: store.addItem,
    removeItem: store.removeItem,
    isPendingPdf: isPending,
    downloadInvoiceAsPdf,
    clearInvoice: store.clearInvoice,
  };
};
