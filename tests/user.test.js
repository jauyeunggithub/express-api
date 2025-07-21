const request = require("supertest");
const app = require("../server"); // Ensure app is exported correctly
const db = require("../models");

describe("User API", () => {
  let token = "";

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    await db.sequelize.authenticate();
  });

  test("User registration", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({ username: "john_doe", password: "password123" });

    expect(response.status).toBe(201);
    expect(response.body.username).toBe("john_doe");
  });

  test("User login", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ username: "john_doe", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    token = response.body.token; // Store the token for further tests
  });

  test("Get user profile", async () => {
    const response = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe("john_doe");
  });

  afterAll(async () => {
    await db.sequelize.close();
  });
});
