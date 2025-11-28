import { useInvoiceStore } from "@/store";
import { Invoice, InvoiceCreation } from "@/types";
import { v4 as uuidv4 } from "uuid";

export type InvoiceRepository = {
  save(invoice: InvoiceCreation): Promise<Invoice>;
  get(id: string): Promise<Invoice>;
  update(invoice: InvoiceCreation): Promise<Invoice>;
  delete(id: string): Promise<void>;
};

/** @deprecated - I was messing around with design patterns */
export class LocalStorageInvoiceRepo implements InvoiceRepository {
  async save(invoice: InvoiceCreation): Promise<Invoice> {
    const id = crypto.randomUUID();
    const fullInvoice: Invoice = { ...invoice, id };
    localStorage.setItem(id, JSON.stringify(fullInvoice));
    return fullInvoice;
  }

  async get(id: string): Promise<Invoice> {
    const data = localStorage.getItem(id);
    if (!data) throw new Error("Invoice not found");
    return JSON.parse(data);
  }

  async update(invoice: Invoice): Promise<Invoice> {
    if (!invoice.id) throw new Error("Missing ID");
    localStorage.setItem(invoice.id, JSON.stringify(invoice));
    return invoice as Invoice;
  }

  async delete(id: string): Promise<void> {
    localStorage.removeItem(id);
  }
}

export class ZustandInvoiceManager implements InvoiceRepository {
  private store = useInvoiceStore.getState();

  async save(invoice: InvoiceCreation): Promise<Invoice> {
    const id = this.store.invoice.id || uuidv4();
    const fullInvoice: Invoice = {
      ...invoice,
      id,
    };

    this.store.setInvoice(fullInvoice);
    return fullInvoice;
  }

  async get(id: string): Promise<Invoice> {
    const activeInvoice = this.store.invoice;

    if (activeInvoice.id === id) {
      return activeInvoice;
    }

    throw new Error(`Invoice with ID ${id} is not the active editor state.`);
  }

  async update(invoice: Invoice): Promise<Invoice> {
    if (!invoice.id) {
      throw new Error("Cannot update an invoice entity without an ID.");
    }
    this.store.setInvoice(invoice);
    return invoice;
  }

  async delete(_id: string): Promise<void> {
    this.store.clearInvoice();
  }
}
