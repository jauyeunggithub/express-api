const request = require("supertest");
const app = require("../server"); // Ensure correct path to app
const db = require("../models");

describe("POST /posts", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    await db.sequelize.authenticate();
  });

  it("should create a new post", async () => {
    process.env.TEST_TOKEN = "token";

    const res = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({ title: "Test Post", content: "This is a test post" });

    // Assert the status code and response body
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test Post");
    expect(res.body.content).toBe("This is a test post");
  });

  afterAll(async () => {
    await db.sequelize.close();
  });
});
