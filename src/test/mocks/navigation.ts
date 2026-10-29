import { vi } from "vitest";

export const routerMock = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

export const navigationState = {
  pathname: "/",
  searchParams: new URLSearchParams(),
  params: {} as Record<string, string | string[]>,
};

export const resetNavigationMocks = () => {
  Object.values(routerMock).forEach((fn) => fn.mockReset());
  navigationState.pathname = "/";
  navigationState.searchParams = new URLSearchParams();
  navigationState.params = {};
};
