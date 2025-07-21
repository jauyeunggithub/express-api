const request = require("supertest");
const app = require("../server"); // Ensure app is exported correctly
const db = require("../models"); // This imports your db object which contains sequelize and models

describe("POST /comments", () => {
  // Declare variables to hold the postId and authentication token
  // These will be populated in the beforeEach hook for each test.
  let testPostId;
  let authToken;

  // beforeEach runs before *each* individual test in this describe block.
  beforeEach(async () => {
    // 1. Ensure a clean database for this specific test
    await db.sequelize.sync({ force: true });
    // Authentication is generally not needed before *each* test after sync,
    // as sync implies a working connection.
    // await db.sequelize.authenticate();

    // 2. Create a test user and log them in to get a valid authentication token.
    // This makes the test independent of the user registration/login tests.
    const username = `comment_user_${Date.now()}`; // Use unique username for isolation
    const password = "testpassword123";

    await request(app)
      .post("/api/users/register") // Assuming your user registration route is /api/users/register
      .send({ username, password });

    const loginResponse = await request(app)
      .post("/api/users/login") // Assuming your user login route is /api/users/login
      .send({ username, password });

    authToken = loginResponse.body.token; // Store the token for this test

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
    const res = await request(app)
      .post("/api/comments")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ postId: testPostId, content: "This is a test comment content" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.content).toBe("This is a test comment content");
    expect(res.body.postId).toBe(testPostId);
  });

  it("should return 401 if no authorization token is provided", async () => {
    const res = await request(app).post("/api/comments").send({
      postId: testPostId,
      content: "This comment should fail due to missing token",
    });

    expect(res.status).toBe(401);
  });
});
