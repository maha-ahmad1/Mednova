import type { ProgramDetail } from "@/features/programs/types/program"

interface ProgramDetailContentProps {
  program: ProgramDetail
}

export function ProgramDetailContent({ program }: ProgramDetailContentProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">نظرة عامة</h2>
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{program.description}</p>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">عن المدرب</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#32A88D]/10 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-[#32A88D]">{program.title.charAt(0)}</span>
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{program.title}</h4>
            <p className="text-sm text-gray-600">{program.title}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
