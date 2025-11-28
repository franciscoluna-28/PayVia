import { v4 as uuidv4 } from "uuid";

/**
 * Generates a unique, URL-safe invoice reference ID.
 * Example: INV-S7Y-5R8Q1A
 */
export const generateInvoiceReferenceId = (): string => {
  const randomChunk = Math.random().toString(36).substring(2, 8).toUpperCase();

  const randomUuid = uuidv4().replace(/-/g, "").substring(0, 4).toUpperCase();

  return `INV-${randomUuid}-${randomChunk}`;
};

export const generateUuid = (): string => uuidv4();
