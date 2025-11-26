AI integration notes
====================

This project includes a small AI assistant to help auto-fill invoice fields using Google Gemini (via REST) with a safe fallback.

Configuration
- Set `GOOGLE_API_KEY` (or `GEMINI_API_KEY`) in your environment to enable real Gemini calls.
- Optionally set `GEMINI_MODEL` to a supported model id (default: `models/gemini-1.5`).
- To force the mock heuristic behavior during development set `USE_MOCK_AI=true`.

Where it lives
- API endpoint: `src/app/api/ai-fill/route.ts` (App Router)
- Client UI: `src/app/page.tsx` (AI Assistant panel, client-side fetch)

Security & best practices
- Keep `GOOGLE_API_KEY` only on server environment variables (do not expose to the client).
- We perform a small server-side rate-limit to reduce accidental spam; for production use a durable rate limiter (Redis, Cloudflare Workers KV, etc.).
- The API attempts to extract JSON from model output; for higher reliability use a structured response format (function calling or strict JSON-only responses) when available from the provider.

Next steps (suggested)
- Replace the best-effort Gemini REST call with the official SDK for stronger stability.
- Add robust validation and sanitization for fields returned by the LLM before merging into invoices.
- Add server-side logging/observability and billing controls (quotas) to avoid runaway costs.
