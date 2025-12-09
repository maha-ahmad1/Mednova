export const timeZones = [
  { id: "gmt+3", label: "توقيت الرياض (GMT+3)", offset: "+03:00" },
  { id: "gmt+4", label: "توقيت دبي (GMT+4)", offset: "+04:00" },
  { id: "gmt+2", label: "توقيت القاهرة (GMT+2)", offset: "+02:00" },
  { id: "gmt+5", label: "توقيت باكستان (GMT+5)", offset: "+05:00" },
];

export const formatDateArabic = (formatFn: (d: Date, f: string, o?: any) => string, date: Date, locale: any) => formatFn(date, "dd MMMM yyyy", { locale });
