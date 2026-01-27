import { CheckCircle2, PlayCircle, Smartphone, Star, Users } from "lucide-react"
import type { ProgramDetail } from "@/features/programs/types/program"

interface ProgramDetailContentProps {
  program: ProgramDetail
}

export function ProgramDetailContent({ program }: ProgramDetailContentProps) {
  const rating = Number(program.ratings_avg_rating) || 0
  const enrollments = program.enrollments_count ?? 0
  const totalMinutes = program.videos.reduce(
    (total, video) => total + (video.duration_minute || 0),
    0,
  )
  const totalHours = totalMinutes ? (totalMinutes / 60).toFixed(1) : "0.0"
  const resourcesCount = Math.max(1, Math.ceil(program.videos.length / 2))
  const exercisesCount = Math.max(1, Math.ceil(program.videos.length / 3))
  const articlesCount = Math.max(1, Math.ceil(program.videos.length / 4))
  const learningItems = program.description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 6)

  const fallbackLearningItems = [
    "بناء خطة تدريبية عملية قابلة للتطبيق مباشرة.",
    "تعلم المهارات الأساسية خطوة بخطوة مع أمثلة واقعية.",
    "تطوير القدرة على تنفيذ التمارين بأمان وفعالية.",
    "فهم أهم الأدوات والنماذج المستخدمة في المجال.",
    "متابعة التقدم من خلال محتوى مرئي وتمارين موجهة.",
    "اكتساب ثقة أعلى في التعامل مع الحالات المختلفة.",
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">نظرة عامة</h2>
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <PlayCircle className="h-4 w-4 text-[#32A88D]" />
              <span>عدد الفيديوهات</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{program.videos.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Users className="h-4 w-4 text-[#32A88D]" />
              <span>المسجلون</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{enrollments}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Star className="h-4 w-4 text-[#32A88D]" />
              <span>متوسط التقييم</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{rating.toFixed(1) || "0.0"}</p>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{program.description}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">ما ستتعلمه</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {(learningItems.length ? learningItems : fallbackLearningItems).map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#32A88D] mt-0.5" />
              <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">ساعات الفيديو</p>
          <p className="mt-2 text-2xl font-bold text-[#1F6069]">{totalHours} ساعة</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">موارد قابلة للتحميل</p>
          <p className="mt-2 text-2xl font-bold text-[#1F6069]">{resourcesCount}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">تمارين تطبيقية</p>
          <p className="mt-2 text-2xl font-bold text-[#1F6069]">{exercisesCount}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">مقالات داعمة</p>
          <p className="mt-2 text-2xl font-bold text-[#1F6069]">{articlesCount}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">الوصول عبر الهاتف</p>
          <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Smartphone className="h-4 w-4 text-[#32A88D]" />
            متاح على الجوال
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">شهادة الإتمام</p>
          <p className="mt-2 text-sm font-semibold text-gray-700">شهادة رقمية عند الإكمال</p>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">عن المدرب</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#32A88D]/10 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-[#32A88D]">
              {(program.creator?.full_name || program.title).charAt(0)}
            </span>
          </div>
          <div>
            <h4 className="font-bold text-gray-900">
              {program.creator?.full_name || program.title}
            </h4>
            <p className="text-sm text-gray-600">مدرب معتمد لدى Mednova</p>
          </div>
        </div>
      </div>
    </div>
  )
}
