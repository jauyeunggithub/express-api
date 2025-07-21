const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../services/emailService");

const register = async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashedPassword });

  // Send welcome email
  sendEmail(
    user.username,
    "Welcome to the app",
    "Thank you for registering!"
  ).then(() => console.log("Email sent"));

  res.status(201).json(user);
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (!user) return res.status(404).json({ message: "User not found" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
};

const getMe = async (req, res) => {
  const user = await User.findByPk(req.user.userId);
  res.json(user);
};

module.exports = { register, login, getMe };
