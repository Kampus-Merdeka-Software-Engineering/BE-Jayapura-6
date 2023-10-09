const db = require("../models");
const Product = db.product;

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addProduct = async (req, res) => {
  const { name, category, price } = req.body;
  const image = req.file ? req.file.path : null;
  try {
    const newProductItem = await Product.create({
      image: image,
      name: name,
      category: category,
      price: price,
    });

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan",
      cartItem: newProductItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan produk: " + error.message,
    });
  }
};
// exports.getHotProduct = async (req, res) => {
//   try {
//     const hotProducts = await Product.findAll({
//       order: [['rating', 'DESC']],
//       limit: 4
//     });

//     res.status(200).json({
//       success: true,
//       hotProducts: hotProducts
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Gagal mengambil produk hot: ' + error.message
//     });
//   }
// };

exports.getArrivalProduct = async (req, res) => {
  try {
    const hotProducts = await Product.findAll({
      order: [["createdAt", "DESC"]],
      limit: 4,
    });

    res.status(200).json({
      success: true,
      hotProducts: hotProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal mengambil produk hot: " + error.message,
    });
  }
};
