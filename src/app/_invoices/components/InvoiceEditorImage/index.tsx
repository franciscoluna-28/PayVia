import { InvoiceStore } from "@/store/InvoiceStore";
import { Invoice } from "@/types";
import { UploadIcon } from "lucide-react";

type Props = {
  invoice: Invoice;
  updateField: InvoiceStore["updateField"];
};

export function InvoiceImage({ invoice, updateField }: Props) {
  return (
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
  );
}
