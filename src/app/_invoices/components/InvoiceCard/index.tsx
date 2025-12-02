import { cn } from "@/lib/utils";

export function InvoiceCard({
  children,
  className,
  props,
}: {
  children: React.ReactNode;
  className?: string;
  props?: React.ComponentProps<"div">;
}) {
  return (
    <div
      id="invoice"
      {...props}
      className={cn(
        "w-full max-w-[800px] border p-8 space-y-8 shadow-sm bg-white rounded-md my-4",
        className
      )}
    >
      {children}
    </div>
  );
}
