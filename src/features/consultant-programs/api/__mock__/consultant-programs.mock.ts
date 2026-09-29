import type {
  ConsultantProgram,
  ProgramSalesStats,
} from "../../types/consultant-program";

// Mock data matching the "Specialist Programs" API contract — consultant section
// (creation, review submission, sales). Kept confined to this file so swapping
// to the real /api/consultant/... endpoints later touches nothing else.
// Program id 12 intentionally mirrors the public browse-stage mock (stage 1) —
// same approved course, seen here from the specialist's own dashboard.
let mockConsultantPrograms: ConsultantProgram[] = [
  {
    id: 20,
    title_ar: "تمارين أسفل الظهر",
    title_en: "Lower Back Exercises",
    description_ar: "برنامج تمهيدي لتقوية أسفل الظهر.",
    description_en: "An introductory program to strengthen the lower back.",
    what_you_will_learn_ar: "تمارين آمنة لتقوية أسفل الظهر",
    what_you_will_learn_en: "Safe exercises to strengthen the lower back",
    cover_image: null,
    price: "15.000",
    status: "draft",
    status_label: "مسودة",
    rejection_reason: null,
    platform_commission_rate: "10.00",
    your_earning_per_sale: "13.500",
    sales_count: 0,
    can: { edit: true, delete: true, submit: false, archive: false, add_video: true },
    videos: [],
  },
  {
    id: 21,
    title_ar: "تأهيل الرسغ",
    title_en: "Wrist Rehab",
    description_ar: "برنامج تأهيلي للرسغ بعد الإصابات الشائعة.",
    description_en: "A rehab program for the wrist after common injuries.",
    what_you_will_learn_ar: "أساسيات تأهيل الرسغ",
    what_you_will_learn_en: "Wrist rehab fundamentals",
    cover_image: "/images/placeholder-course.jpg",
    price: "18.000",
    status: "pending",
    status_label: "قيد المراجعة",
    rejection_reason: null,
    platform_commission_rate: "10.00",
    your_earning_per_sale: "16.200",
    sales_count: 0,
    can: { edit: false, delete: false, submit: false, archive: false, add_video: false },
    videos: [
      {
        id: 50,
        title_ar: "مقدمة",
        title_en: "Intro",
        order: 1,
        is_program_intro: true,
        is_free: false,
        review_status: "pending",
        rejection_reason: null,
      },
    ],
  },
  {
    id: 12,
    title_ar: "تأهيل الكتف بعد الإصابة",
    title_en: "Shoulder rehab",
    description_ar:
      "برنامج شامل لإعادة تأهيل الكتف بعد الإصابات الرياضية والجراحية.",
    description_en:
      "A comprehensive shoulder rehab program after sports and surgical injuries.",
    what_you_will_learn_ar: "أساسيات إعادة تأهيل الكتف وتمارين تقوية آمنة",
    what_you_will_learn_en: "Shoulder rehab fundamentals and safe strengthening",
    cover_image: "/images/placeholder-course.jpg",
    price: "20.000",
    status: "approved",
    status_label: "منشور",
    rejection_reason: null,
    platform_commission_rate: "10.00",
    your_earning_per_sale: "18.000",
    sales_count: 14,
    can: { edit: false, delete: false, submit: false, archive: true, add_video: true },
    videos: [
      {
        id: 40,
        title_ar: "مقدمة",
        title_en: "Intro",
        order: 1,
        is_program_intro: true,
        is_free: false,
        review_status: "approved",
        rejection_reason: null,
      },
      {
        id: 41,
        title_ar: "التمارين الأولى",
        title_en: "First exercises",
        order: 2,
        is_program_intro: false,
        is_free: false,
        review_status: "approved",
        rejection_reason: null,
      },
    ],
  },
  {
    id: 22,
    title_ar: "تمارين الرقبة",
    title_en: "Neck Exercises",
    description_ar: "برنامج لتخفيف آلام الرقبة وتحسين المرونة.",
    description_en: "A program to relieve neck pain and improve flexibility.",
    what_you_will_learn_ar: "تمارين إطالة وتقوية للرقبة",
    what_you_will_learn_en: "Stretching and strengthening exercises for the neck",
    cover_image: "/images/placeholder-course.jpg",
    price: "12.000",
    status: "rejected",
    status_label: "مرفوض",
    rejection_reason: "جودة الصوت في الفيديو الثالث ضعيفة",
    platform_commission_rate: "10.00",
    your_earning_per_sale: "10.800",
    sales_count: 0,
    can: { edit: true, delete: false, submit: true, archive: false, add_video: true },
    videos: [
      {
        id: 60,
        title_ar: "مقدمة",
        title_en: "Intro",
        order: 1,
        is_program_intro: true,
        is_free: false,
        review_status: "rejected",
        rejection_reason: "الفيديو مقطوع بالنص",
      },
    ],
  },
];

const mockProgramSales: Record<number, ProgramSalesStats> = {
  12: {
    sales_count: 14,
    total_earnings: "252.000",
    by_month: [
      { month: "2026-08", sales_count: 3, earnings: "54.000" },
      { month: "2026-09", sales_count: 2, earnings: "36.000" },
      { month: "2026-10", sales_count: 9, earnings: "162.000" },
    ],
  },
};

const emptySales = (): ProgramSalesStats => ({
  sales_count: 0,
  total_earnings: "0.000",
  by_month: [],
});

export const getMockConsultantPrograms = () => mockConsultantPrograms;

export const getMockConsultantProgramById = (id: number) =>
  mockConsultantPrograms.find((program) => program.id === id) ?? null;

export const getMockProgramSales = (id: number) =>
  mockProgramSales[id] ?? emptySales();

export const upsertMockConsultantProgram = (
  id: number,
  patch: Partial<ConsultantProgram>,
) => {
  mockConsultantPrograms = mockConsultantPrograms.map((program) =>
    program.id === id ? { ...program, ...patch } : program,
  );
  return getMockConsultantProgramById(id);
};

export const insertMockConsultantProgram = (
  program: ConsultantProgram,
) => {
  mockConsultantPrograms = [program, ...mockConsultantPrograms];
  return program;
};

export const removeMockConsultantProgram = (id: number) => {
  mockConsultantPrograms = mockConsultantPrograms.filter(
    (program) => program.id !== id,
  );
};

export const nextMockProgramId = () =>
  Math.max(0, ...mockConsultantPrograms.map((program) => program.id)) + 1;

export const nextMockVideoId = () =>
  Math.max(
    0,
    ...mockConsultantPrograms.flatMap((program) =>
      program.videos.map((video) => video.id),
    ),
  ) + 1;
