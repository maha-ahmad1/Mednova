import { describe, expect, it } from "vitest";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";
import { renderWithProviders, screen } from "@/test/render";
import BreadcrumbNav from "./BreadcrumbNav";

const cases = [
  { locale: "ar", dir: "rtl", home: arMessages.navbar.home },
  { locale: "en", dir: "ltr", home: enMessages.navbar.home },
] as const;

describe("BreadcrumbNav", () => {
  it.each(cases)("renders in $locale ($dir)", ({ locale, dir, home }) => {
    renderWithProviders(<BreadcrumbNav currentPage="Current page" />, {
      locale,
    });

    expect(screen.getByTestId("providers-root")).toHaveAttribute("dir", dir);
    expect(screen.getByRole("link", { name: home })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByText("Current page")).toBeInTheDocument();
  });
});
