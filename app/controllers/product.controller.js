const db = require("../models");
const Product = db.product;

exports.getAllproduct = async (req, res) => {
  try {
    const product = await Product.findAll();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHotProduct = async (req, res) => {
  try {
    const hotproduct = await Product.findAll({
      order: [['rating', 'DESC']],
      limit: 4
    });

    res.status(200).json({
      success: true,
      hotproduct: hotproduct
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
    const hotproduct = await Product.findAll({
      order: [['createdAt', 'DESC']],
      limit: 4
    });

    res.status(200).json({
      success: true,
      hotproduct: hotproduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil produk hot: ' + error.message
    });
  }
};