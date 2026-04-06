import { useLocale } from "next-intl";

const locale = useLocale();

export interface NavLink {
  id: number;
  titleKey: string;
  link: string;
  dropdown?: DropdownItem[];
}

export interface DropdownItem {
  id: number;
  titleKey: string;
  link: string;
}

export const NavLinks: NavLink[] = [
  {
    id: 1,
    titleKey: "navbar.home",
    link: `/${locale}`,
  },
  {
    id: 2,
    titleKey: "navbar.specialists",
    link: `/${locale}/specialists`,
  },
  {
    id: 3,
    titleKey: "navbar.programs",
    link: `/${locale}/programs`,
  },
  {
    id: 4,
    titleKey: "navbar.devices",
    link: `/${locale}/smartgloves`,
    dropdown: [
      { id: 1, titleKey: "navbar.smartGlove", link: `/${locale}/smartgloves` },
    ],
  },
];