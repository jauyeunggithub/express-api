const request = require("supertest");
const app = require("../server");
const db = require("../models");

describe("POST /comments", () => {
  let postId;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    await db.sequelize.authenticate();
    const post = await db.Post.create({
      title: "Test Post",
      content: "This is a test post content",
    });

    // Store the postId for use in the comment creation test
    postId = post.id;
  });

  it("should create a new comment", async () => {
    process.env.TEST_TOKEN = "token";

    // Send the request to the server
    const res = await request(app)
      .post("/comments")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({ postId, content: "This is a test comment" });

    // Assert the response status and content
    expect(res.status).toBe(201);
    expect(res.body.content).toBe("This is a test comment");
  });

  afterAll(async () => {
    await db.sequelize.close();
  });
});
