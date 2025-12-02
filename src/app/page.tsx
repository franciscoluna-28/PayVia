"use client";

import { Button } from "@/components/ui/button";
import { useInvoiceActions } from "@/hooks/useInvoiceEditor";
import useInvoiceHydration from "@/hooks/useInvoiceHydration";
import { InvoiceNavigation } from "./_invoices/components/InvoiceEditorActions";
import { RemovePdfDialog } from "./_invoices/components/ClearInvoiceDialog";
import { InvoiceWrapper } from "./_invoices/components/InvoiceEditorWrapper";
import { FileDownIcon } from "lucide-react";
import { ClientManagerDialog } from "./_clients/components/ClientManagerDialog";

export default function Home() {
  const {
    invoice,
    subtotal,
    tax,
    total,
    downloadInvoiceAsPdf,
    addItem,
    removeItem,
    updateField,
    updateItem,
    isPendingPdf,
    clearInvoice,
  } = useInvoiceActions();

  const hydrated = useInvoiceHydration();

  return (
    <main className="max-w-[1500px] flex justify-center m-auto p-4">
      <InvoiceNavigation
        clearInvoiceSlot={
          <RemovePdfDialog
            isPendingPdf={isPendingPdf}
            clearInvoice={clearInvoice}
          />
        }
        downloadInvoiceAsPdfSlot={
          <Button variant="ghost" onClick={downloadInvoiceAsPdf} disabled={isPendingPdf}>
          <FileDownIcon className="mr-2 h-4 w-4" /> <span>Download PDF</span> 
          </Button>
        }
        clientsSlot={
          <ClientManagerDialog/>  
        }
      />

      <InvoiceWrapper
        isLoading={!hydrated}
        invoice={invoice}
        updateField={updateField}
        updateItem={updateItem}
        removeItem={removeItem}
        addItem={addItem}
        subtotal={subtotal}
        tax={tax}
        total={total}
      />
    </main>
  );
}
