import type { RequestHandler } from "msw";

// Base URL: https://api.mednovacare.com — feature paths include "/api/...".
// Response bodies must come from src/test/fixtures (real API responses).
//
// import { http, HttpResponse } from "msw";
// import wallet from "../fixtures/consultant-wallet.json";
// http.get("https://api.mednovacare.com/api/financial/consultant/wallet", () =>
//   HttpResponse.json(wallet),
// ),
export const handlers: RequestHandler[] = [];
