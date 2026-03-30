import type { ReactNode } from "react";

interface WithSkeletonProps {
  isLoading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
}

export function WithSkeleton({ isLoading, skeleton, children }: WithSkeletonProps) {
  if (isLoading) {
    return <>{skeleton}</>;
  }

  return <>{children}</>;
}
