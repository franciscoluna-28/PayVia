import { JSX } from "react";

type Props = {
  clearInvoiceSlot: JSX.Element;
  downloadInvoiceAsPdfSlot: JSX.Element;
  clientsSlot: JSX.Element;
};

export function InvoiceNavigation({
  clearInvoiceSlot,
  downloadInvoiceAsPdfSlot,
  clientsSlot,
}: Props) {
  return (
    <div className="fixed top-4 right-4 z-10 w-[200px]">
      <div className="flex flex-col space-y-4">
        {clearInvoiceSlot}
        {downloadInvoiceAsPdfSlot}
        {clientsSlot}
      </div>
    </div>
  );
}
