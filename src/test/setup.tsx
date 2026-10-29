import "@testing-library/jest-dom/vitest";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import {
  navigationState,
  resetNavigationMocks,
  routerMock,
} from "./mocks/navigation";
import { server } from "./msw/server";

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
  usePathname: () => navigationState.pathname,
  useSearchParams: () => navigationState.searchParams,
  useParams: () => navigationState.params,
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...rest
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    locale?: string;
    children?: ReactNode;
  }) => {
    const { locale, ...anchorProps } = rest;
    void locale; // next-intl-only prop, not a DOM attribute
    return (
      <a href={href} {...anchorProps}>
        {children}
      </a>
    );
  },
  useRouter: () => routerMock,
  usePathname: () => navigationState.pathname,
  redirect: vi.fn(),
  getPathname: ({ href }: { href: string }) => href,
}));

// jsdom gaps commonly hit by Radix / Swiper / virtualized lists.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
globalThis.ResizeObserver ??= NoopObserver as unknown as typeof ResizeObserver;
globalThis.IntersectionObserver ??=
  NoopObserver as unknown as typeof IntersectionObserver;
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
Element.prototype.scrollIntoView ??= vi.fn();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  resetNavigationMocks();
});
afterAll(() => server.close());
