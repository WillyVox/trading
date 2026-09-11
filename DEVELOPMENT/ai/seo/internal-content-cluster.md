28. Internal content clusters should become a major strategy

Canstar does this well.

Their trading comparison page links into:

platform guides
fee explanations
investing basics
provider-related content
methodology

Their page isn't isolated.

Your relational architecture is actually better suited to this than AusMarket's current implementation.

You already have:

ArticleProvider
ArticleCryptoAsset
ArticleRelated
ArticleType

So you can automatically build clusters such as:

CoinSpot
├── CoinSpot provider page
├── CoinSpot fees guide
├── CoinSpot vs Kraken
├── How to buy Bitcoin with CoinSpot
├── CoinSpot news
└── Crypto exchange comparison

That's where your database design becomes an SEO advantage.