const { authJwt } = require("../middleware");
const controller = require("../controllers/product.controller");

const upload = require("../config/upload");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  // get all product
  app.get("/api/products", [authJwt.verifyToken], controller.getAllProducts);

  // get product by rating
  // app.get(
  //   "/api/product/hot-product",
  //   [authJwt.verifyToken],
  //   controller.getHotProduct
  // );

  // add product
  app.post(
    "/api/order/add-product",
    upload.single("image"),
    [authJwt.verifyToken],
    controller.addProduct
  );

  // get product by created
  app.get(
    "/api/product/arrival-product",
    [authJwt.verifyToken],
    controller.getArrivalProduct
  );
};
