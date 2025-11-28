"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { X, Plus, UploadIcon } from "lucide-react";
import { generatePDF } from "./utils/pdf";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [invoice, setInvoice] = useState({
    logo: null,
    fullName: "Your Name",
    role: "Backend Developer",
    billToCompany: "Client Company Name",
    billToAddress: "Client Address",
    billToZip: "Postal Code",
    invoiceNumber: "INV-0001",
    invoiceDate: "2025-11-25",
    dueDate: "2025-12-10",
    items: [
      { description: "Consulting services", quantity: 1, amount: 200 },
      { description: "Cloud infrastructure setup", quantity: 1, amount: 200 },
    ],
    taxRate: 12,
    notes:
      "Payment is due within 15 days of the invoice date. Please include the invoice number in your payment reference. Thank you for your business.",
    payVia: "Bank Transfer",
    accountName: "Account Holder Name",
    accountEmail: "billing@example.com",
  });

  const updateField = (field: string, value: string | number) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...invoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoice((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "Enter item description", quantity: 1, amount: 200 },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
  const tax = (subtotal * invoice.taxRate) / 100;
  const total = subtotal + tax;

  const handleAIFill = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const resp = await fetch("/api/ai-fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt, invoice }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        console.error("AI error", data);
        setAiLoading(false);
        return;
      }

      const filled = data?.filled || {};
      // Merge returned fields into the invoice state
      setInvoice((prev) => {
        const merged = { ...prev, ...filled };
        if (filled.items) merged.items = filled.items;
        return merged;
      });

      setAiLoading(false);
    } catch (err) {
      console.error(err);
      setAiLoading(false);
    }
  };

  {
    const [isPending, startTransition] = useTransition();
    const [aiLoading, setAiLoading] = useState(false);

    const generatePdf = async () => {
      try {
        await generatePDF({
          elementToPrintId: "invoice",
          fileName: "invoice.pdf",
        });
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    };

    const formAction = () => {
      startTransition(async () => {
        setAiLoading(true);
        await generatePdf();
        setAiLoading(false);
      });
    };

    return (
      <main className="max-w-[1500px] flex justify-center m-auto p-4 font-sans text-gray-800">
        <Button
          className="fixed top-4 right-4 z-10 w-[200px]"
          disabled={isPending}
          onClick={() => formAction()}
        >
          {isPending ? "Generating PDF..." : "Download PDF"}
        </Button>
        {/* <div className="fixed top-4 left-4 z-10 w-[360px]">
        <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
          <div className="text-sm font-semibold mb-2">AI Assistant</div>
          <textarea
            className="w-full h-20 p-2 border rounded text-sm"
            placeholder="Describe what you want the invoice to contain, e.g. 'Make invoice to Acme Corp for $500 on 2025-11-30, include consulting services'"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <Button onClick={handleAIFill} disabled={aiLoading}>
              {aiLoading ? "Filling..." : "Auto-fill with AI"}
            </Button>
            <Button variant="ghost" onClick={() => setAiPrompt("")}>Clear</Button>
          </div>
        </div>
      </div> */}
        <div
          id="invoice"
          className="w-full max-w-[800px] border p-8 space-y-8 shadow-sm bg-white rounded-md my-4"
        >
          <section className="grid grid-cols-2 gap-4 items-start pb-6 border-b border-dashed border-gray-300">
            <div className="flex flex-col gap-3 items-start">
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <div className="w-28 h-28 rounded-md border border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    {invoice.logo ? (
                      <img
                        alt="Company logo"
                        src={invoice.logo}
                        className="w-full h-full rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex items-center">
                        <UploadIcon className="text-gray-400" />
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const logoUrl = URL.createObjectURL(file);
                        updateField("logo", logoUrl);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="mr-auto flex flex-col space-y-1">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Full Name
                    </Label>
                    <Input
                      value={invoice.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      placeholder="Full Name"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700">
                      Role
                    </Label>
                    <Input
                      value={invoice.role}
                      onChange={(e) => updateField("role", e.target.value)}
                      placeholder="Role / Position"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="font-bold text-lg mb-2">Bill To</div>
          <section className="grid grid-cols-2 gap-8 pt-4">
            {/* Left column: Bill To */}

            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">
                  Company
                </Label>
                <Input
                  value={invoice.billToCompany}
                  onChange={(e) => updateField("billToCompany", e.target.value)}
                  placeholder="Company"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">
                  Address
                </Label>
                <Input
                  value={invoice.billToAddress}
                  onChange={(e) => updateField("billToAddress", e.target.value)}
                  placeholder="Address"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">
                  Zip Code
                </Label>
                <Input
                  value={invoice.billToZip}
                  onChange={(e) => updateField("billToZip", e.target.value)}
                  placeholder="Zip Code"
                />
              </div>
            </div>

            {/* Right column: Invoice details */}
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">
                  Invoice #
                </Label>
                <Input
                  value={invoice.invoiceNumber}
                  onChange={(e) => updateField("invoiceNumber", e.target.value)}
                  placeholder="INV-0001"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">
                  Invoice Date
                </Label>
                <DatePicker
                  value={new Date(invoice.invoiceDate)}
                  onChange={(date) => {
                    if (date) {
                      updateField(
                        "invoiceDate",
                        date.toISOString().slice(0, 10)
                      );
                    }
                  }}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">
                  Due Date
                </Label>
                <DatePicker
                  value={new Date(invoice.dueDate)}
                  onChange={(date) => {
                    if (date) {
                      updateField("dueDate", date.toISOString().slice(0, 10));
                    }
                  }}
                />
              </div>
            </div>
          </section>

          <section className="pt-4">
            <Table className="border-t border-b border-gray-300 overflow-hidden">
              <TableHeader>
                <TableRow className="border-b border-gray-300 bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-left text-xs font-semibold text-gray-600 py-3">
                    Description
                  </TableHead>
                  <TableHead className="text-left text-xs font-semibold text-gray-600 py-3">
                    Quantity
                  </TableHead>
                  <TableHead className="text-left text-xs font-semibold text-gray-600 py-3">
                    Amount
                  </TableHead>
                  <TableHead className="text-left w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item, index) => (
                  <TableRow
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="py-3">
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          updateItem(index, "description", e.target.value)
                        }
                        placeholder="Enter item description"
                        className="text-sm"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", Number(e.target.value))
                        }
                        placeholder="30"
                        className="text-sm text-left"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <Input
                        type="number"
                        value={item.amount}
                        onChange={(e) =>
                          updateItem(index, "amount", Number(e.target.value))
                        }
                        placeholder="200"
                        className="text-sm text-left"
                      />
                    </TableCell>
                    <TableCell className="text-left py-3">
                      <button
                        onClick={() => removeItem(index)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        aria-label="Delete item"
                      >
                        <X size={16} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={addItem}
                variant="outline"
                className="gap-2 bg-transparent"
              >
                <Plus size={18} />
                Add Item
              </Button>
            </div>
          </section>
          <section className="grid justify-end-safe mr-auto!">
            <div className="w-full max-w-md space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between items-center px-2">
                <Label className="font-medium">Subtotal</Label>
                <div className="text-sm font-medium">{subtotal.toFixed(2)}</div>
              </div>

              {/* Tax Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex justify-between items-center px-2 py-1"
                  >
                    <Label className="font-medium">
                      Tax Rate
                      {invoice.taxRate !== null ? ` (${invoice.taxRate}%)` : ""}
                    </Label>
                    <div className="text-sm font-medium text-gray-800">
                      {tax.toFixed(2)}
                    </div>
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-64 p-4 border rounded-md"
                  align="end"
                  side="bottom"
                >
                  <div className="space-y-3">
                    <Label>Tax rate (%)</Label>
                    <Input
                      type="number"
                      max="100"
                      inputMode="decimal"
                      value={invoice.taxRate ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        updateField("taxRate", v === "" ? "" : Number(v));
                      }}
                      placeholder="12"
                      className="w-full text-right"
                      autoFocus
                    />
                    <p className="text-xs text-gray-500">
                      Computed tax:{" "}
                      <span className="font-medium">{tax.toFixed(2)}</span>
                    </p>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Total */}
              <div className="flex justify-between items-center border-t pt-3">
                <div className="text-base font-semibold">Total ($)</div>
                <div className="text-base font-semibold">
                  {total.toFixed(2)}
                </div>
              </div>
            </div>
          </section>

          <section className="pt-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4 border p-6 rounded-md">
                <h2 className="font-bold text-lg">Payment Details</h2>
                <div className="space-y-3 max-w-xs">
                  <div className="space-y-3">
                    <Label>Method</Label>
                    <Input
                      value={invoice.payVia}
                      onChange={(e) => updateField("payVia", e.target.value)}
                      placeholder="e.g. Zelle"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Name</Label>
                    <Input
                      value={invoice.accountName}
                      onChange={(e) =>
                        updateField("accountName", e.target.value)
                      }
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Email</Label>
                    <Input
                      value={invoice.accountEmail}
                      onChange={(e) =>
                        updateField("accountEmail", e.target.value)
                      }
                      placeholder="john@zelle.com"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3 p-4">
                <h2 className="font-bold text-lg">Notes</h2>
                <Textarea
                  className="w-full h-32 resize-none leading-normal border rounded-md p-2"
                  value={invoice.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Add any extra details here..."
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }
}
