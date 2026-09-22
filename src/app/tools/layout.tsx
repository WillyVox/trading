import type { ReactNode } from "react";
import { TopicClusterLinks } from "@/components/seo/TopicClusterLinks";

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <aside className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <TopicClusterLinks
            clusterId="share-trading"
            limit={3}
            title="Share trading research path"
          />
          <TopicClusterLinks
            clusterId="crypto"
            limit={3}
            title="Crypto research path"
          />
        </div>
      </aside>
    </>
  );
}
