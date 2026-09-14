"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { ImageWithDims } from "./ImageWithDims";
import { VideoEmbed } from "./VideoEmbed";
import { markersToEditorHtml, editorHtmlToMarkers } from "./markerBridge";

interface ArticleRichEditorProps {
  /** Same form field name the plain textarea used ("content") — actions.ts
   *  and validation.ts read this from FormData and need no changes. */
  name: string;
  /** article.content exactly as stored today: sanitized HTML. */
  initialHtml: string;
}

function parseYouTubeOrVimeo(url: string): { provider: "youtube" | "vimeo"; videoId: string } | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? { provider: "youtube", videoId: id } : null;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? { provider: "youtube", videoId: id } : null;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? { provider: "vimeo", videoId: id } : null;
    }
  } catch {
    // not a valid URL — fall through to null
  }
  return null;
}

export function ArticleRichEditor({ name, initialHtml }: ArticleRichEditorProps) {
  const [html, setHtml] = useState(initialHtml);

  const editor = useEditor({
    extensions: [
      // h2/h3/h4 only, matching sanitize.ts's ALLOWED_TAGS — h1 is reserved
      // for the page title everywhere else in the app.
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Link.configure({ openOnClick: false }), // sanitize.ts adds rel/target itself at save time regardless
      ImageWithDims,
      VideoEmbed,
    ],
    content: markersToEditorHtml(initialHtml),
    immediatelyRender: false, // required for Next.js App Router SSR — avoids a hydration mismatch
    onUpdate: ({ editor }) => setHtml(editorHtmlToMarkers(editor.getHTML())),
  });

  if (!editor) return null;

  return (
    <div className="rounded border border-navy/20">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="prose max-w-none px-4 py-3" />
      {/* This is the only line ArticleForm.tsx needs to change: swap
          <textarea name="content" defaultValue={...} /> for
          <ArticleRichEditor name="content" initialHtml={...} /> — the
          server action, validation schema and sanitizer are untouched. */}
      <input type="hidden" name={name} value={html} readOnly />
    </div>
  );
}

/**
 * `onUpdate` (used above for the hidden input) only fires on content
 * changes, not on selection changes — clicking from one image to another
 * without typing anything wouldn't otherwise re-render this toolbar, so
 * the align buttons' highlighted state would lag behind the actual
 * selection. `transaction` fires on both.
 */
function useEditorTransactionTick(editor: Editor) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const rerender = () => setTick((t) => t + 1);
    editor.on("transaction", rerender);
    return () => {
      editor.off("transaction", rerender);
    };
  }, [editor]);
}

function Toolbar({ editor }: { editor: Editor }) {
  useEditorTransactionTick(editor);

  const addImage = () => {
    // window.prompt stands in for a proper modal here — the real version
    // should also offer "choose from media library" once that exists
    // (see the Media/Storage recommendation from the architecture review).
    const url = window.prompt("Image URL");
    if (!url) return;
    const alt = window.prompt("Alt text (required — flagged by the editorial checklist if missing)") ?? "";
    // `setImage`'s TS signature only knows the stock Image extension's
    // attrs (src/alt/title) — a real integration should augment that
    // command's type via module declaration merging so `align` type-checks
    // properly; the cast is a stand-in for that here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editor.chain().focus().setImage({ src: url, alt, align: "center" } as any).run();
  };

  const addVideo = () => {
    const url = window.prompt("YouTube or Vimeo URL");
    if (!url) return;
    const parsed = parseYouTubeOrVimeo(url);
    if (!parsed) {
      window.alert("Couldn't recognize that as a YouTube or Vimeo URL.");
      return;
    }
    const caption = window.prompt("Caption (optional)") ?? "";
    editor.chain().focus().insertContent({ type: "videoEmbed", attrs: { ...parsed, caption } }).run();
  };

  return (
    <div className="flex flex-wrap gap-1 border-b border-navy/10 bg-cream/60 p-2">
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
        Bold
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
        Italic
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
      >
        H3
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
        List
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
        1. List
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
        Quote
      </ToolbarButton>
      <ToolbarButton onClick={addImage}>Image</ToolbarButton>
      <ToolbarButton onClick={addVideo}>Video</ToolbarButton>
      {editor.isActive("image") && (
        <>
          <span className="mx-1 w-px self-stretch bg-navy/10" aria-hidden />
          <ToolbarButton
            onClick={() => editor.chain().focus().updateAttributes("image", { align: "left" }).run()}
            active={editor.isActive("image", { align: "left" })}
          >
            ⯇ Left
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().updateAttributes("image", { align: "center" }).run()}
            active={editor.isActive("image", { align: "center" })}
          >
            Center
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().updateAttributes("image", { align: "right" }).run()}
            active={editor.isActive("image", { align: "right" })}
          >
            Right ⯈
          </ToolbarButton>
        </>
      )}
    </div>
  );
}

function ToolbarButton({ onClick, active, children }: { onClick: () => void; active?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1 text-sm font-medium ${active ? "bg-navy text-white" : "text-navy hover:bg-navy/10"}`}
    >
      {children}
    </button>
  );
}