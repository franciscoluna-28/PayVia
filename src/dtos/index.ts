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
const nullableString = z.string().nullable();

export const InvoiceItemCreationSchema = z.object({
  description: nonEmptyString,
  quantity: positiveInt,
  amount: currencyAmount,
});

export const InvoiceCreationSchema = z
  .object({
    logo: nullableString,
    fullName: nonEmptyString,
    clientId: z.uuid().optional(),
    role: nonEmptyString,
    billToCompany: nonEmptyString,
    billToAddress: nonEmptyString,
    billToZip: nonEmptyString,
    invoiceNumber: nonEmptyString,
    invoiceDate: isoDateString,
    dueDate: isoDateString,
    items: z
      .array(InvoiceItemCreationSchema)
      .min(1, "At least one item is required"),
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

export const InvoiceItemEntitySchema = InvoiceCreationSchema.extend({
  id: z.uuid(),
});

export const ClientCreationSchema = z.object({
  fullName: nonEmptyString,
  address: nonEmptyString,
  zip: nonEmptyString,
});

export const ClientEntitySchema = ClientCreationSchema.extend({
  id: z.uuid(),
});