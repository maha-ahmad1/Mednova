"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

interface FormStepCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function FormStepCard({ title, description, children, className }: FormStepCardProps) {
  return (
    <Card className={cn("max-w-5xl mx-auto shadow-lg border-0", className)}>
      <CardHeader dir="rtl" className="mb-2">
        <CardTitle className="text-2xl font-bold ">{title}</CardTitle>
        <CardDescription className="text-md">{description}</CardDescription>
      </CardHeader>

      <CardContent className="px-8">{children}</CardContent>
    </Card>
  );
}
