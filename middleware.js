const jwt = require("jsonwebtoken");
const config = require("./config");

const checkToken = (req, res, next) => {
  let token = req.headers["authorization"];
  console.log(token);

  if (token) {
    token = token.slice(7); // Remove "Bearer " prefix from the token

    jwt.verify(token, config.key, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: true,
          message: "valid Token"
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({
      status: false,
      message: "No token provided"
    });
  }
};

module.exports = {
  checkToken: checkToken,
};