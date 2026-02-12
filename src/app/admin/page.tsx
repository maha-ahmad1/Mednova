import { Card } from "@/components/ui/card";

export default function AdminOverviewPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">نظرة عامة</h1>
      <Card className="p-6 text-sm text-muted-foreground">
        مرحبًا بك في لوحة تحكم MedNova. استخدم القائمة الجانبية للتنقل بين أقسام الإدارة.
      </Card>
    </div>
  );
}
