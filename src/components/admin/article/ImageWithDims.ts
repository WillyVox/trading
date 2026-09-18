import Image from '@tiptap/extension-image';

/**
 * Extends Tiptap's stock Image extension with `width`/`height` attributes
 * so its HTML output matches exactly what sanitize.ts already allowlists
 * for `<img>`: src, alt, title, width, height (see
 * src/lib/articles/sanitize.ts — ALLOWED_ATTRIBUTES.img). Deliberately
 * adds nothing else: no `class`, no `style`. The sanitizer would strip
 * either anyway, and image alignment/width should be expressed
 * structurally (e.g. a wrapping <figure> variant) rather than as a raw
 * inline-style escape hatch — consistent with why sanitize.ts drops
 * `class` everywhere else in article body HTML.
 */
export const ImageWithDims = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute('width'),
        renderHTML: (attributes) =>
          attributes.width ? { width: attributes.width } : {},
      },
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute('height'),
        renderHTML: (attributes) =>
          attributes.height ? { height: attributes.height } : {},
      },
      // Mirrors sanitize.ts's ALLOWED_IMAGE_ALIGN — "left" | "center" | "right".
      // Rendered as `data-align`; globals.css turns that into the actual
      // float/centering rules. Defaulting to "center" means a freshly
      // inserted image (see addImage() in ArticleRichEditor.tsx) always
      // has an explicit, sanitizer-valid value rather than none at all.
      align: {
        default: 'center',
        parseHTML: (element) => element.getAttribute('data-align') ?? 'center',
        renderHTML: (attributes) => ({
          'data-align': attributes.align ?? 'center',
        }),
      },
    };
  },
});
