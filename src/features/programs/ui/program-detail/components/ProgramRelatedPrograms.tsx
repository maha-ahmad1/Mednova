// "use client"

// import { useProgramsQuery } from "@/features/programs/hooks"
// import type { Program } from "@/features/programs/types/program"
// import { ProgramCard } from "@/shared/ui/components/ProgramCard"

// interface ProgramRelatedProgramsProps {
//   currentProgramId: number
// }

// export function ProgramRelatedPrograms({ currentProgramId }: ProgramRelatedProgramsProps) {
//   const { data } = useProgramsQuery()

//   const relatedPrograms = (data?.data || [])
//     .filter((program: Program) => program.id !== currentProgramId)
//     .slice(0, 3)

//   if (!relatedPrograms.length) {
//     return null
//   }

//   return (
//     <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
//       <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
//         <h2 className="text-2xl font-bold text-gray-900">برامج ذات صلة</h2>
//         <span className="text-sm text-gray-500">اختر برنامجاً آخر لتكملة رحلتك</span>
//       </div>
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {relatedPrograms.map((program: Program) => (
//           <ProgramCard
//             key={program.id}
//             program={program}
//             showCreator={true}
//             showEnrollments={true}
//             showStatus={true}
//           />
//         ))}
//       </div>
//     </section>
//   )
// }
