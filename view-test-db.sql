\c nc_news_test;

-- \dt


-- SELECT  COUNT(article_id) AS comment_count
-- FROM comments
-- WHERE article_id = 3
-- ;

-- Select * FROM articles 
-- LEFT JOIN comments ON articles.article_id = comments.article_id;

SELECT topic FROM articles
GROUP BY topic;


-- SELECT articles.*, COUNT(comments.article_id) AS comment_count
-- FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
-- WHERE articles.article_id = 1
-- GROUP BY articles.article_id;

-- SELECT articles.*, CAST(COUNT(comments.article_id)AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;

-- SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;