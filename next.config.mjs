/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;

/**
 * If after launching, and google already indexed your url, then you change the path,
 * you need to config as following to migrate the path.
 * explain:
 * Without a redirect, anyone visiting the old URL gets a 404. More importantly, if Google has already discovered/indexed the old URL, or another page/bookmark links to it, that old URL suddenly disappears.

With:

{
  source: "/top-cryptocurrency-exchanges-in-australia",
  destination: "/guides/top-cryptocurrency-exchanges-in-australia",
  permanent: true,
}

the migration becomes:

OLD URL
/top-cryptocurrency-exchanges-in-australia
              │
              │ permanent redirect
              ▼
NEW URL
/guides/top-cryptocurrency-exchanges-in-australia

So users, bookmarks, external links and search crawlers are sent to the new canonical location.

const nextConfig = {
  async redirects() {
    return [
      {
        source: "/top-cryptocurrency-exchanges-in-australia",
        destination: "/guides/top-cryptocurrency-exchanges-in-australia",
        permanent: true,
      },
      {
        source: "/share-trading-for-beginners",
        destination: "/guides/share-trading-for-beginners",
        permanent: true,
      },
    ];
  },
};
 */
