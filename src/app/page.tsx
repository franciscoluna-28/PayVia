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
import { X, Plus } from "lucide-react";
import { generatePDF } from "./utils/pdf";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export default function Home() {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [invoice, setInvoice] = useState({
    logo: "LOGO",
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
        { description: "Enter item description", quantity: 30, amount: 200 },
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
      await generatePDF("invoice");
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
        className="w-full max-w-[800px] border border-gray-300 p-8 space-y-8 shadow-sm bg-white rounded-md"
      >
        <section className="grid grid-cols-2 gap-4 items-start pb-6 border-b border-dashed border-gray-300">
          <div className="flex flex-col gap-3 items-start">
            {/* <img
              alt="Company logo"
              className="w-28 h-28 border border-gray-400 object-cover"
            />
            <Input
              value={invoice.logo}
              onChange={(e) => updateField("logo", e.target.value)}
              variant="invisible"
              placeholder="Logo text (optional)"
            /> */}
          </div>
          <div className="flex flex-col items-end text-right space-y-2">
            <Input
              value={invoice.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              variant="invisible"
              placeholder="FULL NAME"
            />
            <Input
              value={invoice.role}
              onChange={(e) => updateField("role", e.target.value)}
              variant="invisible"
              placeholder="ROLE"
            />
          </div>
        </section>
        <section className="grid grid-cols-2 gap-8 pt-4">
          <div className="space-y-1">
            <div className="font-bold text-lg mb-2">Bill To</div>
            <Input
              value={invoice.billToCompany}
              onChange={(e) => updateField("billToCompany", e.target.value)}
              variant="invisible"
              placeholder="Company"
            />
            <Input
              value={invoice.billToAddress}
              onChange={(e) => updateField("billToAddress", e.target.value)}
              variant="invisible"
              placeholder="Address"
            />
            <Input
              value={invoice.billToZip}
              onChange={(e) => updateField("billToZip", e.target.value)}
              variant="invisible"
              placeholder="Zip Code"
            />
          </div>
          <div className="grid grid-cols-1 gap-y-4">
            <div className="grid grid-cols-2 gap-x-4 items-center">
              <Label className="font-semibold">Invoice #</Label>
              <Input
                value={invoice.invoiceNumber}
                onChange={(e) => updateField("invoiceNumber", e.target.value)}
                variant="invisible"
                placeholder="INV-0001"
              />
            </div>
            <div className="grid grid-cols-2 gap-x-4 items-center">
              <Label className="font-semibold">Invoice Date</Label>
              <DatePicker
                value={new Date(invoice.invoiceDate)}
                onChange={(date) => {
                  if (date) {
                    updateField("invoiceDate", date.toISOString().slice(0, 10));
                  }
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-x-4 items-center">
              <Label className="font-semibold">Due Date</Label>
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
          <Table className="border-t border-b border-gray-300">
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
                      variant="invisible"
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
                      variant="invisible"
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
                      variant="invisible"
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
        <section className="flex justify-end pt-4">
          <div className="w-full sm:w-1/2 md:w-1/3 space-y-2">
            <div className="flex justify-between items-center">
              <Label className="font-semibold">Sub Total</Label>
              <div>{subtotal.toFixed(2)}</div>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="invisible">
                  <Label className="text-gray-600 font-medium">
                    Tax Rate
                    {`${
                      invoice.taxRate === null ? "" : ` (${invoice.taxRate}%)`
                    }`}
                  </Label>
                  <div className="text-gray-800">{tax.toFixed(2)}</div>
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="border rounded-md p-3 w-56"
                align="end"
                side="bottom"
              >
                <div className="space-y-2">
                  <Label className="text-gray-600">Tax rate (%)</Label>
                  <Input
                    type="number"
                    max={"100"}
                    inputMode="decimal"
                    value={invoice.taxRate === null ? "" : invoice.taxRate}
                    onChange={(e) => {
                      const v = e.target.value;
                      updateField("taxRate", v === "" ? "" : Number(v));
                    }}
                    placeholder="12"
                    className="w-full text-right"
                    autoFocus
                  />

                  <div className="text-sm text-gray-500">
                    Computed tax:{" "}
                    <span className="font-medium">{tax.toFixed(2)}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex justify-between items-center pt-2 border-t border-gray-300 mt-2">
              <div className="font-bold text-xl">Total ($)</div>
              <div className="font-bold text-xl">{total.toFixed(2)}</div>
            </div>
          </div>
        </section>
        <section className="pt-6">
          <div className="font-bold text-lg mb-2">Notes</div>
          {/** So... html2canvas does not support the textarea component. This is a questionable way to make it work... */}
          <div
            className="w-full border-none h-20 text-sm hover:border-none hover:outline-0 outline-0 p-0 resize-none leading-normal"
            contentEditable
            suppressContentEditableWarning
            onChange={(e) => updateField("notes", e.currentTarget.textContent)}
            style={{ backgroundColor: "transparent", color: "inherit" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            {invoice.notes}
          </div>
        </section>
        <section className="">
          <div className="font-bold text-lg mb-2">Payment Information</div>
          <div className="space-y-1">
            <div className="grid grid-cols-2 gap-x-4">
              <div className="font-semibold">Pay Via</div>
              <Input
                value={invoice.payVia}
                onChange={(e) => updateField("payVia", e.target.value)}
                variant="invisible"
                placeholder="Zelle"
              />
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <div className="font-semibold">Account name</div>
              <Input
                value={invoice.accountName}
                onChange={(e) => updateField("accountName", e.target.value)}
                variant="invisible"
                placeholder="Francisco Luna"
              />
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <div className="font-semibold">Account email</div>
              <Input
                value={invoice.accountEmail}
                onChange={(e) => updateField("accountEmail", e.target.value)}
                variant="invisible"
                placeholder="fran@zelle.com"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

}
