/**
 * Define all statics slugs for static guides
 */


export const STATIC_SLUG_IDS = {
    TOP_CRYPTO_EXCHANGES: "top-cryptocurrency-exchanges-in-australia",
    STEPS_TO_BUY_CRYPTO: "simple-steps-to-buy-cryptocurrency",
    START_INVESTING_IN_CRYPTO: "how-to-start-investing-in-crypto-for-beginners",
    SHARE_TRADING_FOR_BEGINNERS: "share-trading-for-beginners"
}

/**
 * When generate a static guide/news article, 
 * image name name must be the same as slug id
 * @param slug 
 * @returns 
 */
export const getStaticGuideArticleImage = (slug: string) => `/images/articles/${slug}.svg`;

/**
 * Define url path of a static article
 * @param slug 
 * @returns 
 */
export const getStaticGuideArticleHref = (slug: string) => `/guides/${slug}`;