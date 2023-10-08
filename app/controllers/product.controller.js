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

exports.getHotProduct = async (req, res) => {
  try {
    const hotProducts = await Product.findAll({
      order: [['rating', 'DESC']],
      limit: 4
    });

    res.status(200).json({
      success: true,
      hotProducts: hotProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil produk hot: ' + error.message
    });
  }
};

exports.getArrivalProduct = async (req, res) => {
  try {
    const hotProducts = await Product.findAll({
      order: [['createdAt', 'DESC']],
      limit: 4
    });

    res.status(200).json({
      success: true,
      hotProducts: hotProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil produk hot: ' + error.message
    });
  }
};