const jwt = require("jsonwebtoken");

// :) 👇
const secretKey = "helping@teachers.providing/toolsfor;better*learning";

const createToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    secretKey,
    { expiresIn: "1d" }
  );
};

function verifyToken(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    throw new Error("Invalid token");
  }
}

module.exports = { createToken, verifyToken };
