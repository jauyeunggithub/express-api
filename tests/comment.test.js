const request = require("supertest");
const app = require("../server");
const db = require("../models");

describe("POST /comments", () => {
  let testPostId;
  let authToken;
  let testUserId;

  beforeEach(async () => {
    await db.sequelize.sync({ force: true });
    const username = `comment_user_${Date.now()}`;
    const password = "testpassword123";
    const email = `${username}@example.com`;

    await request(app)
      .post("/api/users/register")
      .send({ username, password, email });

    const loginResponse = await request(app)
      .post("/api/users/login")
      .send({ username, password });

    authToken = loginResponse.body.token;
    const post = await db.Post.create({
      title: "Test Post for Commenting",
      content: "This is content for a post that will receive a comment.",
    });
    testPostId = post.id;
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it("should create a new comment", async () => {
    const commentContent = "This is a test comment content";
    const res = await request(app)
      .post("/api/comments")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        commentableId: testPostId,
        commentableType: "Post",
        content: commentContent,
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();
    expect(res.body.content).toBe(commentContent);
    expect(res.body.commentableId).toBe(testPostId);
    expect(res.body.commentableType).toBe("Post");
    expect(res.body.UserId).toBeTruthy();

    expect(res.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        content: commentContent,
        commentableId: testPostId,
        commentableType: "Post",
        UserId: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
  });

  it("should return 401 if no authorization token is provided", async () => {
    const res = await request(app).post("/api/comments").send({
      commentableId: testPostId,
      commentableType: "Post",
      content: "This comment should fail due to missing token",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Access denied");
  });

  it("should return 404 if post does not exist", async () => {
    const nonExistentPostId = testPostId + 999; // An ID that definitely doesn't exist

    const res = await request(app)
      .post("/api/comments")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        commentableId: nonExistentPostId,
        commentableType: "Post",
        content: "This comment should fail because the post does not exist",
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe(`Post not found for commenting.`);
  });
});
