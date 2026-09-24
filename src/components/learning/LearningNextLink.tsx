"use client";
import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/analytics/events";
export function LearningNextLink({
  pathId,
  lessonId,
  lessonNumber,
  ...props
}: { pathId: string; lessonId: string; lessonNumber: number } & ComponentProps<
  typeof Link
>) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        trackEvent("next_lesson_clicked", {
          path_id: pathId,
          lesson_id: lessonId,
          lesson_number: lessonNumber,
        });
      }}
    />
  );
}
