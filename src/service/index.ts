import { InvoiceRepository, LocalStorageInvoiceRepo } from "@/adapters";
import { Invoice, InvoiceCreation } from "@/types";

let activeServiceInstance: InvoiceService | null = null;

export class InvoiceService {
  private activeRepo: InvoiceRepository;

  private constructor(defaultRepo: InvoiceRepository) {
    this.activeRepo = defaultRepo;
  }

  public static initialize(initialRepo: InvoiceRepository): void {
    if (activeServiceInstance) {
      return;
    }
    activeServiceInstance = new InvoiceService(initialRepo);
  }

  public static getInstance(): InvoiceService {
    if (!activeServiceInstance) {
      throw new Error(
        "InvoiceService not initialized. Call InvoiceService.initialize() first."
      );
    }
    return activeServiceInstance;
  }

  public setRepository(repo: InvoiceRepository): void {
    this.activeRepo = repo;
  }

  async save(invoice: InvoiceCreation): Promise<Invoice> {
    return this.activeRepo.save(invoice);
  }

  async get(id: string): Promise<Invoice> {
    return this.activeRepo.get(id);
  }

  async update(invoice: Invoice): Promise<Invoice> {
    return this.activeRepo.update(invoice);
  }

  async delete(id: string): Promise<void> {
    return this.activeRepo.delete(id);
  }
}
