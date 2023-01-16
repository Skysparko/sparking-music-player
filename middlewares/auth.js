const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();
//checking if the user is logined or not
const isAuthorized = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(404).json({
      err: "authHeader not found",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(404).json({
      err: "token not found",
    });
  }

  const decodedToken = jwt.verify(token, process.env.SECRET);

  const user = await User.findOne({ userID: decodedToken.user.id });

  if (!user) {
    return res.status(404).json({
      err: "user not found",
    });
  }

  req.user = user;
  next();
};
module.exports = isAuthorized;
