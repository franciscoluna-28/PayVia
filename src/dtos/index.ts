import { z } from "zod";

const nonEmptyString = z.string().trim().min(1, "Required");
const positiveInt = z.number().int().positive();
const currencyAmount = z.number().nonnegative();
const isoDateString = z
  .string()
  .refine(
    (s) => /^\d{4}-\d{2}-\d{2}$/.test(s),
    "Must be an ISO date string (YYYY-MM-DD)"
  );

export const InvoiceItemSchema = z.object({
  description: nonEmptyString,
  quantity: positiveInt,
  amount: currencyAmount,
});

export const InvoiceSchema = z
  .object({
    logo: nonEmptyString,
    fullName: nonEmptyString,
    role: nonEmptyString,
    billToCompany: nonEmptyString,
    billToAddress: nonEmptyString,
    billToZip: nonEmptyString,
    invoiceNumber: nonEmptyString,
    invoiceDate: isoDateString,
    dueDate: isoDateString,
    items: z.array(InvoiceItemSchema).min(1, "At least one item is required"),
    taxRate: z.number().min(0).max(100),
    notes: z.string().trim().optional(),
    payVia: nonEmptyString,
    accountName: nonEmptyString,
    accountEmail: z.email("Invalid email"),
  })
  .superRefine((data, ctx) => {
    const invoiceDate = new Date(data.invoiceDate);
    const dueDate = new Date(data.dueDate);
    if (dueDate < invoiceDate) {
      ctx.addIssue({
        code: "invalid_format",
        message: "Due date must be after invoice date",
        format: "date",
      });
    }
  });

export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;
