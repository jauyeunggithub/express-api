const request = require("supertest");
const app = require("../server");
const db = require("../models");

describe("User API", () => {
  beforeEach(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("User registration", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({ username: "testuser_register", password: "password123" }); // Use unique username

    expect(response.status).toBe(201); // Expect a 201 Created status
    expect(response.body.username).toBe("testuser_register"); // Verify the username in the response
  });

  // Test for user login (this test needs a user to already exist)
  test("User login", async () => {
    // First, register a user specifically for this login test
    await request(app)
      .post("/api/users/register")
      .send({ username: "testuser_login", password: "password123" });

    // Then, attempt to log in with that user
    const response = await request(app)
      .post("/api/users/login")
      .send({ username: "testuser_login", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test("Get user profile", async () => {
    await request(app)
      .post("/api/users/register")
      .send({ username: "testuser_profile", password: "password123" });

    const loginResponse = await request(app)
      .post("/api/users/login")
      .send({ username: "testuser_profile", password: "password123" });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe("testuser_profile");
  });

  afterAll(async () => {
    await db.sequelize.close();
  });
});
