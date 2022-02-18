\c nc_news_test;

\dt

SELECT comment_id, votes, created_at, author, body
FROM comments
WHERE article_id = 3;

SELECT *
FROM comments
WHERE article_id = 2;