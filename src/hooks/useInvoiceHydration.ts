"use client";

import { useEffect, useState } from "react";
import { useInvoiceStore } from "@/store/InvoiceStore";

export function useInvoiceHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const rehydrate = async () => {
      await useInvoiceStore.persist.rehydrate();
      setHydrated(true);
    };
    rehydrate();
  }, []);

  return hydrated;
}

export default useInvoiceHydration;