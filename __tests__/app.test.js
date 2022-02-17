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

describe("Global 404 test", () => {
  test('returns a 404 status and "path not found" msg', () => {
    return request(app)
      .get("/api/invalid_url")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("path not found");
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
  });
  describe("/api/articles", () => {
    test("responds with status 200 and an array of ALL articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeInstanceOf(Array);
          expect(res.body.articles).toHaveLength(12);
        });
    });
    test("responds with status 200 and each article object has correct properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
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
  });
});
describe("PATCH", () => {
  describe("/api/articles/:article_id", () => {
    test("responds with status 200 and correct object with correctly updated (positive) comment vote", () => {
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
    test('responds with status 404 and msg "article not found" for valid but NON-EXISTENT article', () => {
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
        .patch("/api/articles/invalid_id")
        .send(req)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
        });
    });
    test('responds with status 400 and msg "bad request" when req body uses incorrect type', () => {
      const req = { inc_votes: "ten" };
      return request(app)
        .patch("/api/articles/invalid_id")
        .send(req)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
        });
    });
  });
});
