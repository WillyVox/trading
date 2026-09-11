# 23. Article authors and reviewers should become much more visible

This connects directly with the role architecture you asked about earlier.

On a trading/financial article I'd eventually display:

Written by
Huy Vo

Reviewed by
Jane Smith

Published
11 September 2026

Last reviewed
11 September 2026

4 min read

1,428 views

Then each author can have:

/authors/huy-vo

with:

bio
areas covered
recent articles
relevant experience
editorial role

This resembles what Canstar and Finder are doing well. Canstar explicitly surfaces editorial and research personnel plus fact-checking.

Google also strongly encourages accurate authorship information and bylines where users would expect them.

24. I would add author URLs to structured data later

Once that author architecture exists:

{
  "@type": "Person",
  "name": "Huy Vo",
  "url": "https://.../authors/huy-vo"
}

would be better than only:

{
  "@type": "Person",
  "name": "Huy Vo"
}

Google specifically recommends an author URL where available because it helps identify the author.

But don't implement this until the author page actually exists.