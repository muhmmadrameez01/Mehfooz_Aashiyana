const jwt = require("jsonwebtoken");
const config = require("./config");

const checkToken = (req, res, next) => {
  let token = req.headers["authorization"];
  console.log(token);

  if (token) {
    jwt.verify(token, config.key, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          
          success: false,
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({
      status: false,
      message: "No token provided",
    });
  }
};

module.exports = {
  checkToken: checkToken,
};
