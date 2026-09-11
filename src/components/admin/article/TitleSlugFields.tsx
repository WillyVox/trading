"use client";

import { useState } from "react";
import { slugify } from "@/lib/articles/slug";
import { Notice } from "@/components/ui/Notice";

/**
 * The only reason this pair needs to be a Client Component (Req.md §6 —
 * "use client only for genuinely interactive editor behaviour"): the slug
 * auto-derives from the title as the admin types, until they edit the slug
 * directly, at which point auto-derivation stops. Every other field in the
 * form is a plain server-rendered input.
 */
export function TitleSlugFields({
  initialTitle,
  initialSlug,
  isPublished,
}: {
  initialTitle: string;
  initialSlug: string;
  isPublished: boolean;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [slugTouched, setSlugTouched] = useState(false);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col text-sm sm:col-span-2">
        <span className="mb-1 font-medium text-navy">Title</span>
        <input
          name="title"
          required
          maxLength={200}
          value={title}
          onChange={(e) => {
            const next = e.target.value;
            setTitle(next);
            if (!slugTouched) setSlug(slugify(next));
          }}
          className="rounded-lg border border-border bg-panel-secondary px-3 py-2 text-navy"
          placeholder="5 Best Crypto Exchanges in Australia in 2026"
        />
      </label>

      <label className="flex flex-col text-sm sm:col-span-2">
        <span className="mb-1 font-medium text-navy">Slug</span>
        <input
          name="slug"
          required
          maxLength={200}
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          className="rounded-lg border border-border bg-panel-secondary px-3 py-2 font-mono text-sm text-navy"
        />
        <span className="mt-1 text-xs text-muted">Lowercase, hyphen-separated. Auto-fills from the title until you edit it.</span>
      </label>

      {isPublished && slug !== initialSlug && (
        <div className="sm:col-span-2">
          <Notice>
            This article is currently PUBLISHED at the old slug. Changing it will make the old URL 404 — there is no
            redirect in place. Only change this if you understand the SEO impact.
          </Notice>
        </div>
      )}
    </div>
  );
}
