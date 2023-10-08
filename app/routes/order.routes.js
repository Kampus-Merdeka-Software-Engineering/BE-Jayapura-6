const { authJwt } = require("../middleware");
const controller = require("../controllers/order.controller");
const upload = require('../config/upload');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  // get wishlish
  app.get(
    "/api/order/wishlish",
    [authJwt.verifyToken],
    controller.getAllWishlish
  );

  // add wishlish
  app.post(
    "/api/order/wishlish",
    [authJwt.verifyToken],
    controller.addToWishlist
  );

  // delete wishlish
  app.delete(
    "/api/order/wishlish/:id",
    [authJwt.verifyToken],
    controller.removeFromWishlist
  );

  // add to cart
  app.post(
    "/api/order/add-cart",
    upload.single('payment_proof'),
    [authJwt.verifyToken],
    controller.addToCart
  );

  //update to cart
  app.patch(
    "/api/order/update-cart/:id",
    upload.single('payment_proof'),
    [authJwt.verifyToken],
    controller.updateToCart
  );

};