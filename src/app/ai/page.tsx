{
  /*    <Button onClick={downloadInvoiceAsPdf} className="fixed top-4 right-4 z-10 w-[200px]" disabled={isPendingPdf}>
        {isPendingPdf ? "Generating PDF..." : "Download PDF"}
      </Button>
      <Button onClick={downloadInvoiceAsPdf} className="fixed top-4 right-4 z-10 w-[200px]" disabled={isPendingPdf}>
        {isPendingPdf ? "Generating PDF..." : "Download PDF"}
      </Button> */
}
{
  /* <div className="fixed top-4 left-4 z-10 w-[360px]">
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
      </div> */
}

/*   const handleAIFill = async () => {
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
 */

/*     const [aiLoading, setAiLoading] = useState(false); */
