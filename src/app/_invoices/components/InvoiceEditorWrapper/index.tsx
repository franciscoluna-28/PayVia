import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { InvoiceStore } from "@/store/InvoiceStore";
import { ClientId, Invoice } from "@/types";
import { generateInvoiceReferenceId } from "@/utils/uuid";
import { Dice5Icon, Plus, Search, X } from "lucide-react";
import { InvoiceCard } from "../InvoiceCard";
import { InvoiceImage } from "../InvoiceEditorImage";
import useClientStore from "@/store/ClientStore";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Select } from "@/components/ui/select";

type Props = {
  invoice: Invoice;
  updateField: InvoiceStore["updateField"];
  updateItem: InvoiceStore["updateItem"];
  removeItem: InvoiceStore["removeItem"];
  addItem: InvoiceStore["addItem"];
  subtotal: number;
  tax: number;
  total: number;
  isLoaded: boolean;
  mode: "view" | "edit";
};

export function InvoiceWrapper({
  invoice,
  updateField,
  updateItem,
  removeItem,
  addItem,
  subtotal,
  tax,
  total,
  isLoaded,
  mode = "edit",
}: Props) {
  const { clients } = useClientStore();

  const EDIT_ONLY_COMPONENTS = {
    generateInvoiceId:
      mode === "edit" ? (
        <Button
          className="cursor-pointer"
          variant="outline"
          aria-label="Generate random invoice number"
          onClick={() =>
            updateField("invoiceNumber", generateInvoiceReferenceId())
          }
        >
          <Dice5Icon />
        </Button>
      ) : null,

    clientSelectorField: (handleClientSelect: (clientId: ClientId) => void) => {
      return mode === "edit" ? (
        <Field className="max-w-[300px]">
          <FieldLabel>Select Client</FieldLabel>
          <Select
            onValueChange={handleClientSelect}
            value={invoice.clientId ?? ""}
          >
            <SelectTrigger className="w-full">
              <Search size={16} className="text-gray-400 mr-2" />
              <SelectValue placeholder="Select a client or enter manually" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      ) : null;
    },

    addPaymentItem: (addItem: () => void) => {
      return mode === "edit" ? (
        <Button
          onClick={addItem}
          variant="outline"
          className="gap-2 bg-transparent"
        >
          <Plus size={18} />
          Add Item
        </Button>
      ) : null;
    },

    removePaymentItem: (removeItem: (index: number) => void, index: number) => {
      return mode === "edit" ? (
        <TableCell className="text-left py-3">
          <button
            onClick={() => removeItem(index)}
            className="text-gray-300 hover:text-red-500 transition-colors p-1"
            aria-label="Delete item"
          >
            <X size={16} />
          </button>
        </TableCell>
      ) : null;
    },

    taxItem: ({
      invoice,
      tax,
      updateField,
    }: {
      invoice: Invoice;
      tax: number;
      updateField: InvoiceStore["updateField"];
    }) => {
      return mode === "edit" ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center px-2 py-1"
            >
              <FieldLabel className="font-medium">
                Tax Rate
                {invoice.taxRate !== null ? ` (${invoice.taxRate}%)` : ""}
              </FieldLabel>
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
            <FieldGroup>
              <Field>
                <FieldLabel>Tax rate (%)</FieldLabel>
                <Input
                  type="number"
                  max="100"
                  inputMode="decimal"
                  value={invoice.taxRate ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    // Handle empty string or conversion to number
                    updateField("taxRate", v === "" ? null : Number(v));
                  }}
                  placeholder="12"
                  className="w-full text-right"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2">
                  Computed tax:{" "}
                  <span className="font-medium">{tax.toFixed(2)}</span>
                </p>
              </Field>
            </FieldGroup>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="w-full flex justify-between items-center px-2 py-1">
          <FieldLabel className="font-medium">
            Tax Rate {invoice.taxRate !== null ? ` (${invoice.taxRate}%)` : ""}
          </FieldLabel>
          <div className="text-sm font-medium text-gray-800">
            {tax.toFixed(2)}
          </div>
        </div>
      );
    },
  };

  const selectedClient = clients.find((c) => c.id === invoice.clientId);

  const handleClientSelect = (clientId: string) => {
    updateField("clientId", clientId);

    const client = clients.find((c) => c.id === clientId);

    if (client) {
      updateField("billToCompany", client.fullName);
      updateField("billToAddress", client.address);
      updateField("billToZip", client.zip);
    }
  };

  const handleBillToChange = (field: keyof Invoice, value: string) => {
    if (invoice.clientId) {
      updateField("clientId", null);
    }
    updateField(field, value);
  };

  return (
    <InvoiceCard className="min-h-screen">
      {isLoaded ? (
        <div>Loading...</div>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-4 items-start pb-6 border-b border-dashed border-gray-300">
            <div className="flex flex-col gap-3 items-start">
              <div className="flex items-center gap-3">
                <InvoiceImage mode={mode} logo={invoice.logo} updateField={updateField} />
              </div>
            </div>

            <div className="flex flex-col items-end">
              <FieldGroup className="w-full max-w-xs ml-auto">
                <Field>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input
                    value={invoice.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Full Name"
                  />
                </Field>

                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <Input
                    value={invoice.role}
                    onChange={(e) => updateField("role", e.target.value)}
                    placeholder="Role / Position"
                  />
                </Field>
              </FieldGroup>
            </div>
          </section>
          <FieldLegend className="font-bold text-lg mb-2">Bill To</FieldLegend>
          {EDIT_ONLY_COMPONENTS.clientSelectorField(handleClientSelect)}
          <section className="grid grid-cols-2 gap-8 pt-4">
            <FieldGroup>
              <Field>
                <FieldLabel>Company</FieldLabel>
                <Input
                  value={
                    selectedClient
                      ? selectedClient.fullName
                      : invoice.billToCompany
                  }
                  onChange={(e) =>
                    handleBillToChange("billToCompany", e.target.value)
                  }
                  placeholder="Company"
                  readOnly={!!selectedClient}
                  className={selectedClient ? "bg-gray-100 italic" : ""}
                />
              </Field>

              <Field>
                <FieldLabel>Address</FieldLabel>
                <Input
                  value={
                    selectedClient
                      ? selectedClient.address
                      : invoice.billToAddress
                  }
                  onChange={(e) =>
                    handleBillToChange("billToAddress", e.target.value)
                  }
                  placeholder="Address"
                  readOnly={!!selectedClient}
                  className={selectedClient ? "bg-gray-100 italic" : ""}
                />
              </Field>

              <Field>
                <FieldLabel>Zip Code</FieldLabel>
                <Input
                  value={
                    selectedClient ? selectedClient.zip : invoice.billToZip
                  }
                  onChange={(e) =>
                    handleBillToChange("billToZip", e.target.value)
                  }
                  placeholder="Zip Code"
                  readOnly={!!selectedClient}
                  className={selectedClient ? "bg-gray-100 italic" : ""}
                />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel>Invoice #</FieldLabel>
                <div className="flex gap-4">
                  <Input
                    value={invoice.invoiceNumber}
                    onChange={(e) =>
                      updateField("invoiceNumber", e.target.value)
                    }
                    placeholder="INV-0001"
                  />
                  {EDIT_ONLY_COMPONENTS.generateInvoiceId}
                </div>
              </Field>

              <Field className="w-min">
                <FieldLabel>Invoice Date</FieldLabel>
                <Input
                  type="date"
                  value={invoice.invoiceDate}
                  onChange={(e) => {
                    updateField("invoiceDate", e.target.value);
                  }}
                />
              </Field>

              <Field className="w-min">
                <FieldLabel>Due Date</FieldLabel>
                <Input
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => {
                    updateField("dueDate", e.target.value);
                  }}
                />
              </Field>
            </FieldGroup>
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
                        value={item.quantity === 0 ? "" : item.quantity}
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
                        value={item.amount === 0 ? "" : item.amount}
                        onChange={(e) =>
                          updateItem(index, "amount", Number(e.target.value))
                        }
                        placeholder="200"
                        className="text-sm text-left"
                      />
                    </TableCell>
                    {EDIT_ONLY_COMPONENTS.removePaymentItem(removeItem, index)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex gap-2 pt-4">
              {EDIT_ONLY_COMPONENTS.addPaymentItem(addItem)}
            </div>
          </section>
          <section className="flex justify-end pt-4">
            <div className="w-full max-w-md space-y-4">
              <div className="flex justify-between items-center px-2">
                <FieldLabel className="font-medium">Subtotal</FieldLabel>
                <div className="text-sm font-medium">{subtotal.toFixed(2)}</div>
              </div>
              {EDIT_ONLY_COMPONENTS.taxItem({
                invoice,
                tax,
                updateField,
              })}
              <div className="flex justify-between items-center border-t pt-3">
                <div className="text-base font-semibold px-2">Total ($)</div>
                <div className="text-base font-semibold">
                  {total.toFixed(2)}
                </div>
              </div>
            </div>
          </section>
          <section className="pt-6">
            <div className="grid grid-cols-2 gap-8 border p-6 rounded-md">
              <FieldSet className="">
                <FieldLegend className="font-bold text-lg">
                  Payment Details
                </FieldLegend>
                <FieldGroup className="max-w-xs">
                  <Field>
                    <FieldLabel>Method</FieldLabel>
                    <Input
                      value={invoice.payVia}
                      onChange={(e) => updateField("payVia", e.target.value)}
                      placeholder="e.g. Zelle"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Name</FieldLabel>
                    <Input
                      value={invoice.accountName}
                      onChange={(e) =>
                        updateField("accountName", e.target.value)
                      }
                      placeholder="John Doe"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      value={invoice.accountEmail}
                      onChange={(e) =>
                        updateField("accountEmail", e.target.value)
                      }
                      placeholder="john@zelle.com"
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSet className="p-4">
                <FieldLegend className="font-bold text-lg">Notes</FieldLegend>
                <FieldGroup>
                  <Field>
                    <Textarea
                      className="w-full h-32 resize-none leading-normal border rounded-md p-2"
                      value={invoice.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      placeholder="Add any extra details here..."
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </div>
          </section>
        </>
      )}
    </InvoiceCard>
  );
}
