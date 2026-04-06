# Next-Intl Locale Translation Fix

## Issue
Arabic (/ar) shows English text despite correct routing.

## Analysis
- Layout: `getMessages()` + correct locale prop ✓
- request.ts: cookie || paramLocale || 'en' ✓
- LanguageSwitcher: client-side path replace (no cookie set) 
- Middleware: reads but doesn't set NEXT_LOCALE cookie

## Plan Steps:
- [ ] Step 1: Update middleware to set NEXT_LOCALE cookie when routing to new locale
- [ ] Step 2: Update LanguageSwitcher to set cookie + redirect
- [ ] Step 3: Force paramLocale priority in request.ts
- [ ] Step 4: Test /en vs /ar navbar text & RTL
- [ ] Step 5: Complete

## Current Status: Step 1
