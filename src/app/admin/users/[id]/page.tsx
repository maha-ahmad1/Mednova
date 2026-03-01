import { UserDetailsReviewPage } from "@/features/control-panel/users/ui";

interface AdminUserDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailsPage({ params }: AdminUserDetailsPageProps) {
  const { id } = await params;

  return <UserDetailsReviewPage userId={id} />;
}
