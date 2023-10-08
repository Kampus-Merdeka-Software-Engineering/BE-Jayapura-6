const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];

  // jika pakai authorization bearer token
  if(token && token.startsWith('Bearer')) {
    token = token.slice(7, token.length);
  }

  if (!token) {
    return res.status(403).send({
      success: false,
      message: "Tidak ada token yang disediakan !",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        success: false,
        message: "Token tidak sah !",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken: verifyToken,
};
module.exports = authJwt;
