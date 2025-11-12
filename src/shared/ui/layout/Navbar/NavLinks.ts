export interface NavLink {
  id: number;
  title: string;
  link: string;
  dropdown?: DropdownItem[];
}

export interface DropdownItem {
  id: number;
  title: string;
  link: string;
}

export const NavLinks: NavLink[] = [
  {
    id: 1,
    title: "الرئيسية",
    link: "/",
  },
  {
    id: 2,
    title: "خدماتنا",
    link: "/specialists",
    // dropdown: [
    //   { id: 1, title: "حجز موعد", link: "#" },
    //   { id: 2, title: "استشارات", link: "#" },
    //   { id: 3, title: "برنامج رحلة التعافي", link: "#" },
    // ],
  },
  {
    id: 3,
    title: "التخصصات",
    link: "#",
    dropdown: [
      { id: 1, title: "العلاج العضلي الهيكلي", link: "#" },
      { id: 2, title: "العلاج العصبي", link: "#" },
      { id: 3, title: "علاج الأطفال (الاضطرابات الحركية)", link: "#" },
      { id: 4, title: "العلاج بعد العمليات والجراحة", link: "#" },
      { id: 5, title: "العلاج اليدوي (Manual Therapy)", link: "#" },
      { id: 6, title: "العلاج باستخدام الأجهزة (الكهربائي، الموجات، الليزر)", link: "#" },
      { id: 7, title: "إعادة التأهيل الوظيفي", link: "#" },
      { id: 8, title: "العلاج القلبي التنفسي", link: "#" },
    ],
  },
  {
    id: 4,
    title: "الأجهزة",
    link: "#",
    dropdown: [
      { id: 1, title: "جهاز القفاز الذكي", link: "#" },
    ],
  },
  {
    id: 5,
    title: "المختصين",
    link: "/specialists",
  },
];