const request = require("supertest");
const app = require("../server");

describe("POST /comments", () => {
  beforeAll(async () => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("should create a new comment", async () => {
    process.env.TEST_TOKEN = "token";

    // Send the request to the server
    const res = await request(app)
      .post("/comments")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({ postId: 1, content: "This is a test comment" });

    // Assert the response status and content
    expect(res.status).toBe(201);
    expect(res.body.content).toBe("This is a test comment");
  });

  afterAll(async () => {
    console.log.mockRestore();
  });
});
