const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).send("Unauthorized");
    }

    const { userId } = jwt.verify(authorization, process.env.jwtSecret);

    req.userId = userId;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).send("Unauthorized");
  }
};
