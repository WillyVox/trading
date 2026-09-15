import { NavLink } from "./config"

type STATIC_SLUG = "simple-steps-to-buy-cryptocurrency" | "how-to-start-investing-in-crypto-for-beginners" | "share-trading-for-beginners";

export const STATIC_GUIDE_CONFIG: Record<STATIC_SLUG, NavLink> = {
    "simple-steps-to-buy-cryptocurrency": {
        label: "5 Simple Steps to Buy Cryptocurrency",
        href: "/simple-steps-to-buy-cryptocurrency"
    },
    "how-to-start-investing-in-crypto-for-beginners": {
        label: "How to Start Investing in Crypto for Beginners",
        href: "/how-to-start-investing-in-crypto-for-beginners"
    },
    "share-trading-for-beginners": { 
        label: "Share Trading for Beginners", 
        href: "/share-trading-for-beginners" 
    }
}
