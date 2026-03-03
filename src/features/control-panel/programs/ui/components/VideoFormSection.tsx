import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import type { CreateProgramFormValues } from "../../types/create-program-form";

interface VideoFormSectionProps {
  index: number;
  form: UseFormReturn<CreateProgramFormValues>;
  canRemove: boolean;
  onRemove: () => void;
}

export function VideoFormSection({ index, form, canRemove, onRemove }: VideoFormSectionProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">الفيديو #{index + 1}</CardTitle>
        <Button type="button" variant="ghost" size="icon" onClick={onRemove} disabled={!canRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name={`videos.${index}.title_ar`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان الفيديو</FormLabel>
              <FormControl>
                <Input placeholder="أدخل عنوان الفيديو" {...field} dir="rtl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`videos.${index}.duration_minute`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>المدة (دقيقة)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  value={field.value}
                  onChange={(event) => field.onChange(Number(event.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`videos.${index}.order`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>ترتيب الفيديو</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  value={field.value}
                  onChange={(event) => field.onChange(Number(event.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`videos.${index}.video_path`}
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
          name={`videos.${index}.description_ar`}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>وصف الفيديو</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="اكتب وصف الفيديو" {...field} dir="rtl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`videos.${index}.is_program_intro`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 space-y-0 rounded-lg border p-3 md:col-span-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(Boolean(checked))} />
              </FormControl>
              <FormLabel className="mb-0 cursor-pointer">هذا الفيديو مقدمة البرنامج</FormLabel>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
