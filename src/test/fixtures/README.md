# Test fixtures

Fixtures in this folder **must be real API responses** captured from
`https://api.mednovacare.com` (or staging), saved as returned — including the
`{ success, message?, data }` envelope.

- Do not hand-write or "tidy up" payloads; invented shapes hide contract drift.
- Strip personal data (names, phones, emails) and tokens before committing; replace
  values in place, keep keys and types unchanged.
- Name files after the endpoint, e.g. `consultant-wallet.json`.
- Use them from MSW handlers in `src/test/msw/handlers.ts`.
