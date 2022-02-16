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
    test("responds with status 200 and an array of ALL topic objects", () => {
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
});
