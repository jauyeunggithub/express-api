jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({
      messageId: "mock-email-id-123",
      envelope: {
        from: "mock@example.com",
        to: ["recipient@example.com"],
      },
      accepted: ["recipient@example.com"],
      rejected: [],
      response: "250 OK: Email sent via mock",
    }),
  }),
}));

afterEach(() => {
  jest.clearAllMocks();
});
