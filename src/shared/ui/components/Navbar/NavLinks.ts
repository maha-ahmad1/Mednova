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
    titleKey: "home",
    link: "/",
  },
  {
    id: 2,
    titleKey: "specialists",
    link: "/specialists",
  },
  {
    id: 3,
    titleKey: "programs",
    link: "/programs",
  },
  {
    id: 4,
    titleKey: "devices",
    link: "#",
    dropdown: [
      { id: 1, titleKey: "smartGlove", link: "/smartgloves" },
    ],
  },
];