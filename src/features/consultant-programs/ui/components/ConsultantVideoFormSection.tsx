import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface ConsultantVideoFormSectionProps<TValues extends FieldValues> {
  index: number;
  form: UseFormReturn<TValues>;
  basePath: Path<TValues>;
  title?: string;
  canRemove: boolean;
  onRemove: () => void;
}

// Lightweight sibling of the admin VideoFormSection (control-panel/programs) —
// same visual card, but only the fields the consultant contract defines
// (no description_ar / duration_minute, the backend derives duration from the file).
export function ConsultantVideoFormSection<TValues extends FieldValues>({
  index,
  form,
  basePath,
  title,
  canRemove,
  onRemove,
}: ConsultantVideoFormSectionProps<TValues>) {
  const path = (name: string) => `${String(basePath)}.${name}` as Path<TValues>;

  return (
    <Card className="border-dashed">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">
          {title ?? `الفيديو #${index + 1}`}
        </CardTitle>
        <Button type="button" variant="ghost" size="icon" onClick={onRemove} disabled={!canRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name={path("title_ar")}
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان الفيديو (عربي)</FormLabel>
              <FormControl>
                <Input placeholder="أدخل عنوان الفيديو" {...field} dir="rtl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={path("title_en")}
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان الفيديو (إنجليزي)</FormLabel>
              <FormControl>
                <Input placeholder="Enter video title" {...field} dir="ltr" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={path("order")}
          render={({ field }) => (
            <FormItem>
              <FormLabel>ترتيب الفيديو</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  value={field.value as number}
                  onChange={(event) => field.onChange(Number(event.target.value))}
                  className="no-spinner"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={path("video")}
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel>رفع الفيديو</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="video/*"
                  {...field}
                  value={undefined}
                  onChange={(event) => onChange(event.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={path("is_program_intro")}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 space-y-0 rounded-lg border p-3">
              <FormControl>
                <Checkbox
                  checked={Boolean(field.value)}
                  onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                />
              </FormControl>
              <FormLabel className="mb-0 cursor-pointer">هذا الفيديو مقدمة البرنامج</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={path("is_free")}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 space-y-0 rounded-lg border p-3">
              <FormControl>
                <Checkbox
                  checked={Boolean(field.value)}
                  onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                />
              </FormControl>
              <FormLabel className="mb-0 cursor-pointer">فيديو مجاني</FormLabel>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
