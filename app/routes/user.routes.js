const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  // get user all
  app.get(
    "/api/users",
    [authJwt.verifyToken],
    controller.getAllUsers
  );

  // get user by id
  app.get(
    "/api/user/:id",
    [authJwt.verifyToken],
    controller.getUserById
  );

  // update profile user
  app.patch(
    "/api/user/profile/:id",
    [authJwt.verifyToken],
    controller.updateUserProfile
  );

};