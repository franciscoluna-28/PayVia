import { ZustandInvoiceManager } from "@/adapters";
import { InvoiceService } from "@/service";
import React, { createContext, useMemo } from "react";

const InvoiceServiceContext = createContext<InvoiceService | undefined>(
  undefined
);

/** @deprecated - I was testing stuff. I mean, Zustand was enough for this. I don't even know what I'm doing with my life at this point. */
export const InvoiceServiceProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const serviceInstance = useMemo(() => {
    const initialStrategy = new ZustandInvoiceManager();
    InvoiceService.initialize(initialStrategy);
    return InvoiceService.getInstance();
  }, []);

  return (
    <InvoiceServiceContext.Provider value={serviceInstance}>
      {children}
    </InvoiceServiceContext.Provider>
  );
};

export const useInvoiceService = (): InvoiceService => {
  const context = React.useContext(InvoiceServiceContext);
  if (context === undefined) {
    throw new Error(
      "useInvoiceService must be used within an InvoiceServiceProvider"
    );
  }
  return context;
};
