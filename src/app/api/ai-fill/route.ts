import { NextResponse } from "next/server";
import { GoogleGenAI as GoogleGenerativeAI } from "@google/genai";

interface InvoiceItem {
  description: string;
  quantity: number;
  amount: number;
}

interface Invoice {
  logo?: string;
  fullName?: string;
  role?: string;
  billToCompany?: string;
  billToAddress?: string;
  billToZip?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate?: string;
  items?: InvoiceItem[];
  taxRate?: number;
  notes?: string;
  payVia?: string;
  accountName?: string;
  accountEmail?: string;
}

const RATE_LIMIT_WINDOW_MS = 5_000;
const lastRequestAt = new Map<string, number>();

function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

// --- Simple fallback heuristic (retained for robustness) ---
function heuristicFill(prompt: string, invoice?: Invoice): Partial<Invoice> {
  const out: Partial<Invoice> = {};

  const amountMatch = prompt.match(/\$?([0-9]+(?:\.[0-9]{1,2})?)/);
  if (amountMatch && invoice?.items?.length) {
    // Only update the first item's amount for simplicity in the fallback
    out.items = invoice.items.map((it, i) =>
      i === 0 ? { ...it, amount: Number(amountMatch[1]) } : it
    );
  }

  const dateMatch = prompt.match(/(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) out.invoiceDate = dateMatch[1];

  const nameMatch = prompt.match(
    /(?:name is|named|my name is)\s+([A-Z][a-zA-Z ]{1,50})/i
  );
  if (nameMatch) out.fullName = nameMatch[1];

  const companyMatch = prompt.match(
    /(?:for|company|client)\s+([A-Z][a-zA-Z0-9 &.-]{1,60})/i
  );
  if (companyMatch) out.billToCompany = companyMatch[1];

  return out;
}

export async function POST(req: Request) {
  try {
    // --- Rate limiting ---
    const ip = getClientIp(req.headers);
    const now = Date.now();
    const last = lastRequestAt.get(ip) || 0;
    if (now - last < RATE_LIMIT_WINDOW_MS) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    lastRequestAt.set(ip, now);

    // --- Parse body ---
    const body = await req.json();
    const { prompt, invoice }: { prompt?: string; invoice?: Invoice } =
      body || {};
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // --- Init Gemini client ---
    const client = new GoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY || "",
    });

    // Define the strict prompt and system instruction for JSON output
    const systemInstruction = `
  You are an expert financial assistant that reads a user's natural language prompt and fills out an invoice in JSON format.
  
  **Your Core Task is to:**
  1. **Strictly adhere** to the provided JSON schema for the output.
  2. **Perform all required calculations and data transformations** before outputting the final JSON.
  
  **Specific Instructions:**
  * **Date Logic:** If the prompt specifies payment terms (e.g., 'Net 15'), you MUST calculate the exact 'dueDate' by adding the specified days to the 'invoiceDate'.
  * **Line Items:** Convert any listed services or items into the 'items' array. Each item must be a separate object with inferred or explicit 'description', 'quantity' (default to 1 if not specified), and 'amount'.
  * **Professionalism:** All generated text fields, such as 'notes', must be professional, formal, and free of slang.
  * **Output:** Your response MUST be ONLY the JSON object.
  * 
  * If the user requires you to think a specific way, e.g., complete this field, do so. Do NOT deviate from the JSON schema.
`;

    const userPromptText = `
      Invoice schema:
      ${JSON.stringify(invoice || {}, null, 2)}

      User prompt: ${prompt}

      Return ONLY a JSON object with the fields to update. Use the same keys as the invoice.
    `;

    // --- Call Gemini with JSON response config ---
    const result = await client.models.generateContent({
      model: "gemini-2.0-flash", // Use the explicit model string
      contents: [
        {
          role: "user",
          parts: [{ text: userPromptText }],
        },
      ],
      config: {
        systemInstruction: systemInstruction,
        // The most powerful way to enforce JSON output
        responseMimeType: "application/json",
      },
    });

    const text = result.text || "";

    // --- Parse JSON or fall back ---
    let filled: Partial<Invoice> = {};
    try {
      // With responseMimeType: "application/json", the text should be the JSON object
      filled = JSON.parse(text);
    } catch (parseError) {
      console.warn(
        "Gemini JSON parse failed, falling back to heuristic:",
        parseError
      );
      // Fallback in case the model response is malformed or empty
      filled = heuristicFill(prompt, invoice);
    }

    return NextResponse.json({ provider: "gemini", filled });
  } catch (err) {
    console.error("Internal error:", err);
    // Return a 500 status code for internal server errors
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
