import { InvoiceCreationSchema, InvoiceItemCreationSchema } from "@/dtos";
import z from "zod";

export type InvoiceCreation = z.infer<typeof InvoiceCreationSchema>;
export type InvoiceItemCreation = z.infer<typeof InvoiceItemCreationSchema>;
export type Invoice = InvoiceCreation & { id: string };
export type InvoiceId = Invoice["id"];
export type InvoiceItem = InvoiceItemCreation & { id: string };
