const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");

const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("APP", () => {
  describe("404 test", () => {
    test('returns a 404 status and "path not found" msg when invalid url is used', () => {
      return request(app)
        .get("/api/invalid-url")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("path not found");
        });
    });
  });
});
describe("GET", () => {
  describe("/api/topics", () => {
    test("responds with status 200 and an array of ALL topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(res.body.topics).toBeInstanceOf(Array);
          expect(res.body.topics).toHaveLength(3);
        });
    });
    test("each object has slug and description properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          const topics = res.body.topics;
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("/api/articles/:articleId", () => {
    test("responds with status 200 and correct article object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          const article = res.body.article;
          expect(article).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });
    test('responds with status 404 and msg "article not found" for valid but NON-EXISTENT article ID', () => {
      return request(app)
        .get("/api/articles/99999999")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("article not found");
        });
    });
    test('responds with status 400 and msg "bad request" when passed a bad article ID', () => {
      return request(app)
        .get("/api/articles/invalid_id")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
        });
    });
    test("responds with status 200 and article object has a comment count property", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          const { article } = res.body;
          expect(article.comment_count).toBe("11");
        });
    });
  });
  describe("/api/articles", () => {
    test("responds with status 200 and an array of ALL article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
    test("responds with status 200 and articles are sorted into default order (by date - decending)", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("user can change default sorting order to ascending", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("created_at");
        });
    });
    test("user can make sort_by query for votes", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("votes", { descending: true });
        });
    });
    test("user can change sorting order of a query to ascending", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("votes");
        });
    });
    test('responds with status 400 and msg "bad request" when passed invalid sort_by query', () => {
      return request(app)
        .get("/api/articles?sort_by=invalid_query")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual("bad request");
        });
    });
    test('responds with status 400 and msg "bad request" when passed invalid order query', () => {
      return request(app)
        .get("/api/articles?order=invalid_order")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual("bad request");
        });
    });
    test("user can filter articles by topic", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(1);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                topic: "cats",
              })
            );
          });
        });
    });
    test('responds with status 400 and msg "bad request" when passed invalid topic query', () => {
      return request(app)
        .get("/api/articles?topic=invalid_order")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual("bad request");
        });
    });
    test("responds with status 200 and each article object has a comment count property", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles[0].comment_count).toBe("2");
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    test("responds with status 200 and an array of comment objects (specific to article_id)", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then((res) => {
          const comments = res.body.comments;
          expect(comments).toBeInstanceOf(Array);
          expect(comments).toHaveLength(2);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
        });
    });
    test("responds with status 200 and an empty array for a valid & existing article ID with no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((res) => {
          expect(res.body.comments).toEqual([]);
        });
    });
    test("responds with status 200 and comments are sorted by date - ascending", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((res) => {
          const comments = res.body.comments;
          expect(comments).toBeSortedBy("created_at");
        });
    });
    test('responds with status 400 and msg "bad request" when passed a bad article ID', () => {
      return request(app)
        .get("/api/articles/invalid_id/comments")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual("bad request");
        });
    });
    test('responds status 404 and msg "article not found" when passed a valid but non-existent article ID', () => {
      return request(app)
        .get("/api/articles/999999/comments")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toEqual("article not found");
        });
    });
  });
  describe("/api/users", () => {
    test("responds with status 200 and an array of ALL users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toBeInstanceOf(Array);
          expect(users).toHaveLength(4);
        });
    });
    test("each user object has username property", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("/api/users/:username", () => {
    test('"responds with status 200 and correct user object" ', () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
    });
    test('responds with status 404 and msg "user not found" for non-existent username', () => {
      return request(app)
        .get("/api/users/notAUser")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual("user not found");
        });
    });
  });
});
describe("PATCH", () => {
  describe("/api/articles/:article_id", () => {
    test("responds with status 200 and correct object with correctly updated (positive) votes property", () => {
      const req = { inc_votes: 1 };
      return request(app)
        .patch("/api/articles/1")
        .send(req)
        .expect(200)
        .then((res) => {
          expect(res.body.article).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: expect.any(String),
              votes: 101,
            })
          );
        });
    });
    test("responds with status 200 and correct object with corectly updated (negative) comment vote", () => {
      const req = { inc_votes: -10 };
      return request(app)
        .patch("/api/articles/1")
        .send(req)
        .expect(200)
        .then((res) => {
          expect(res.body.article).toEqual(
            expect.objectContaining({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: expect.any(String),
              votes: 90,
            })
          );
        });
    });
    test('responds with status 404 and msg "article not found" for valid ID but NON-EXISTENT article', () => {
      const req = { inc_votes: -10 };
      return request(app)
        .patch("/api/articles/999999999")
        .send(req)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("article not found");
        });
    });
    test('responds with status 400 and msg "bad request" when passed a bad article ID', () => {
      const req = { inc_votes: -10 };
      return request(app)
        .patch("/api/articles/invalid_id")
        .send(req)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
        });
    });
    test('responds with status 400 and msg "bad request" when req body is malformed', () => {
      const req = {};
      return request(app)
        .patch("/api/articles/1")
        .send(req)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
        });
    });
    test('responds with status 400 and msg "bad request" when req body uses incorrect type', () => {
      const req = { inc_votes: "ten" };
      return request(app)
        .patch("/api/articles/1")
        .send(req)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
        });
    });
  });
  describe("/api/comments/:comment_id", () => {
    test("responds with status 200 and correct object with correctly updated (positive) votes property", () => {
      const req = { inc_votes: 1 };
      return request(app)
        .patch("/api/comments/1")
        .send(req)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(
            expect.objectContaining({
              article_id: 1,
              body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              article_id: 9,
              author: "butter_bridge",
              votes: 17,
              created_at: expect.any(String),
            })
          );
        });
    });
    test("responds with status 200 and correct object with correctly updated (negative) votes property", () => {
      const req = { inc_votes: -1 };
      return request(app)
        .patch("/api/comments/1")
        .send(req)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(
            expect.objectContaining({
              article_id: 1,
              body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              article_id: 9,
              author: "butter_bridge",
              votes: 15,
              created_at: expect.any(String),
            })
          );
        });
    });
    test('responds with status 404 and msg "comment not found" for a valid ID of NON-EXISTENT comment', () => {
      const req = { inc_votes: -1 };
      return request(app)
        .patch("/api/comments/999999999")
        .send(req)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("comment not found");
        });
    });
    test('responds with status 400 and msg "bad request" when passed a bad comment ID', () => {
      const req = { inc_votes: -1 };
      return request(app)
        .patch("/api/comments/invalid_id")
        .send(req)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
        });
    });
    test('responds with status 400 and msg "bad request" when req body is malformed', () => {
      const req = {};
      return request(app)
        .patch("/api/comments/1")
        .send(req)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
        });
    });
    test('responds with status 400 and msg "bad request" when req body uses incorrect type', () => {
      const req = { inc_votes: "ten" };
      return request(app)
        .patch("/api/comments/1")
        .send(req)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
        });
    });
  });
});
describe("POST", () => {
  describe("/api/articles/:article_id/comments", () => {
    test("responds with status 201 and an object of the posted comment", () => {
      const req = {
        username: "rogersop",
        body: "Yeah I agree. Totally!",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(req)
        .expect(201)
        .then((res) => {
          expect(res.body.comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              author: "rogersop",
              body: "Yeah I agree. Totally!",
              votes: 0,
              created_at: expect.any(String),
            })
          );
        });
    });
    test('responds with status 404 and msg "article not found" for valid but NON-EXISTENT ID', () => {
      const req = {
        username: "rogersop",
        body: "Yeah I agree. Totally!",
      };
      return request(app)
        .post("/api/articles/99999/comments")
        .send(req)
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({ msg: "article not found" });
        });
    });
    test('responds with status 400 and msg "bad request" when passed a bad ID', () => {
      const req = {
        username: "rogersop",
        body: "Yeah I agree. Totally!",
      };
      return request(app)
        .post("/api/articles/invalid_id/comments")
        .send(req)
        .expect(400)
        .then((res) => {
          expect(res.body).toEqual({ msg: "bad request" });
        });
    });
    test('responds with status 400 and msg "bad request" when req body is malformed', () => {
      const req = {};
      return request(app)
        .post("/api/articles/1/comments")
        .send(req)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
        });
    });
    test('responds with status 400 and msg "bad request" when req body uses incorrect type', () => {
      const req = { inc_votes: "ten" };
      return request(app)
        .post("/api/articles/1/comments")
        .send(req)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
        });
    });
  });
});
describe("DELETE", () => {
  describe("/api/comments/:comment_id", () => {
    test("responds with status 204 and comment is no longer in database", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
          return db.query(`SELECT * FROM comments WHERE comment_id = 1;`);
        })
        .then((res) => {
          expect(res.rows).toEqual([]);
        });
    });
    test('responds with status 400 msg "bad request" when passed a bad comment ID', () => {
      return request(app)
        .delete("/api/comments/invalid_id")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toEqual("bad request");
        });
    });
    test('responds with status 404 msg "comment not found" when passed a valid but NON-EXISTENT comment ID', () => {
      return request(app)
        .delete("/api/comments/999999")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toEqual("comment not found");
        });
    });
  });
});
