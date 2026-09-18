'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from '@tiptap/react';
import { VIDEO_EMBED_TAG_NAME } from './markerBridge';

/**
 * The in-editor representation of `{{video:provider:videoId:caption}}`.
 * `atom: true` because — same as the marker today — there's nothing to
 * edit *inside* it; provider/videoId/caption are set once via the
 * "Insert Video" toolbar action and the whole thing is replaced or
 * deleted as a single unit. See markerBridge.ts for how this round-trips
 * to/from the real marker text that actually gets stored.
 */
export const VideoEmbed = Node.create({
  name: 'videoEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      provider: { default: 'youtube' },
      videoId: { default: '' },
      caption: { default: '' },
    };
  },

  parseHTML() {
    return [
      {
        tag: VIDEO_EMBED_TAG_NAME,
        getAttrs: (element) => ({
          provider:
            (element as HTMLElement).getAttribute('provider') ?? 'youtube',
          videoId: (element as HTMLElement).getAttribute('video-id') ?? '',
          caption: (element as HTMLElement).getAttribute('caption') ?? '',
        }),
      },
    ];
  },

  renderHTML({ node }) {
    return [
      VIDEO_EMBED_TAG_NAME,
      mergeAttributes({
        provider: node.attrs.provider,
        'video-id': node.attrs.videoId,
        caption: node.attrs.caption,
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoEmbedView);
  },
});

function VideoEmbedView({ node, deleteNode }: NodeViewProps) {
  const { provider, videoId, caption } = node.attrs as {
    provider: string;
    videoId: string;
    caption: string;
  };
  return (
    <NodeViewWrapper
      className="border-navy/20 bg-cream my-4 rounded border p-4"
      contentEditable={false}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-navy/70 text-xs font-semibold tracking-wide uppercase">
          {provider} &middot; {videoId || '(no video selected)'}
        </span>
        <button
          type="button"
          onClick={deleteNode}
          className="text-xs font-medium text-red-600 hover:underline"
        >
          Remove
        </button>
      </div>
      {caption ? <p className="text-muted mt-1 text-sm">{caption}</p> : null}
    </NodeViewWrapper>
  );
}
