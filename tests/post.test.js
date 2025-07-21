const request = require("supertest");
const app = require("../server"); // Ensure correct path to app
const db = require("../models");

describe("POST /posts", () => {
  let authToken;

  beforeEach(async () => {
    await db.sequelize.sync({ force: true });
    const username = `post_user_${Date.now()}`;
    const password = "posttestpassword123";

    await request(app).post("/api/users/register").send({ username, password });

    const loginResponse = await request(app)
      .post("/api/users/login")
      .send({ username, password });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it("should create a new post", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ title: "Test Post", content: "This is a test post" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Test Post");
    expect(res.body.content).toBe("This is a test post");
  });

  it("should return 401 if no authorization token is provided", async () => {
    const res = await request(app)
      .post("/api/posts")
      .send({ title: "Unauthorized Post", content: "This should fail." });

    expect(res.status).toBe(401);
  });
});
