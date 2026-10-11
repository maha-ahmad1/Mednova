"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const rejectReasonSchema = z.object({
  reason: z.string().trim().min(10, "سبب الرفض يجب ألا يقل عن 10 أحرف"),
});

type RejectReasonFormValues = z.infer<typeof rejectReasonSchema>;

interface RejectReasonDialogProps {
  open: boolean;
  title: string;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
}

export function RejectReasonDialog({
  open,
  title,
  isSubmitting = false,
  onOpenChange,
  onConfirm,
}: RejectReasonDialogProps) {
  const form = useForm<RejectReasonFormValues>({
    resolver: zodResolver(rejectReasonSchema),
    defaultValues: { reason: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      form.reset({ reason: "" });
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">{title}</DialogTitle>
          <DialogDescription className="text-right">
            يرجى ذكر سبب الرفض بوضوح ليصل إلى المختص.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-2">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>سبب الرفض</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      dir="rtl"
                      placeholder="اكتب سبب الرفض (10 أحرف على الأقل)"
                      onChange={(event) => {
                        field.onChange(event);
                        form.trigger("reason");
                      }}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {field.value.trim().length} / 10 حرف على الأقل
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            إلغاء
          </Button>
          <Button
            variant="destructive"
            className="min-w-28"
            disabled={!form.formState.isValid || isSubmitting}
            onClick={form.handleSubmit((values) => {
              // Guards the handler itself (see ConfirmationModal.handleConfirm) — the
              // disabled prop alone leaves a render-cycle window open to a second click.
              if (isSubmitting) return;
              onConfirm(values.reason.trim());
            })}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الرفض...
              </>
            ) : (
              "رفض"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
