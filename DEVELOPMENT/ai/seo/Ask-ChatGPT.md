# 2026/09/11
clearly check the Article model, and the latest phase of my project,

help me prepare a comprehensive prompt to ask Claude AI that, i wanted



build a new article form for admin users to create an article that can be displayed in news, or guides, or can be linked to a exchange details page and display the article link there for example in exchanges/[slug]/bitcoin, compare/[slug], etc. 

the article must have fields that would be very useful for users, visitors to get the information they really wanted from crypto currency or trading markets

the article must have fields that can be effectively do SEO to and contains common keywords, or anything related so that it could be ranking higher in google or internet searches

article contents can include, display or embed images, or even videos

article contents can be html format

article must display perfectly when users show it

admin users can preview articles in Draft or Review on page to check while visitors can only see them when they are Published

somehow we also need a way to display a component in our app into the article page, for erxample, in the middle of "5 Best crypto exchanges in Australia in 2026", we can have the compare components display those exchanges. 



Similarly to create an article via admin/article page, we need to improve the import article script to add article with more fields.

 you can help review and add more conditions here

our ultimate goal is providing articles with as much good and valued information as possible for google search and ranking to adverstising and promoting our website to more people, especially new users to trading, crypto currency.

also, articles should be able to link to our affiliate partners, so we have more change to redirect users to affiliate platforms. 


# 2
i have implemented Article form for admin to create/preview and publish  an article. please help to check if block 2 is completely fulfilled our expectation?


create article

archive an an article

publish an article

next, help me to prepare a prompt to ask Claude AI to study, understanding, giving feedback, concerns, ideas, approaches, suggestions, then proving a roadmap, design structure and plan of  doing the following thing.



1/ users need to have another type Moderate for example, who can create an article and update article status to under review, so admin can review that article, then admin can archive or publish

2/ article will only be visible to visitors if it matches two condition. status is published, and current time is > article scheduled time

3/ in an article view page, such as news/slug, or guides/id, it must display the author name, and the number of views

4/ in moderate dashboard, there should be a UI to display their own articles, maybe in 4 different sections, Draft (which is created but not submit to under review), Under review, published, and last one is archived articles.

5/ in admin dashboard, there would be the same as moderate dashboard, however, two more sections, first is article list that assigned to them as Reviewer, and next one is admin can see all articles in the db

rememember to append pagination for all tables. 

in the tables, depends on the article status, last column of each row should show the available action if it is eligible for the logged user. like, submit to review, archive, publish, etc



on published article table, there should be a column to display total number of viewing/visting times of that article. so we might update the DB model, and also need to implement a way to track down visiting times when an article is viewed.

feel free to have your own ideas, suggestions, approaches, or feedback if you have any before providing the prompt.
