\c nc_news_test;

\dt

SELECT * FROM articles
WHERE topic = 'mitch'
ORDER BY created_at DESC;


