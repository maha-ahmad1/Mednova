import { ProgramSkeleton } from "./ProgramSkeleton";

// Full-page wrapper around the existing card-grid ProgramSkeleton, shared between
// ProgramsList's own isLoading state and the route-level loading.tsx.
export function ProgramsPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProgramSkeleton count={6} />
      </div>
    </div>
  );
}
