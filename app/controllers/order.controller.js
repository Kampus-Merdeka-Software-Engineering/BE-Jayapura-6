const db = require("../models");
const multer = require('multer');
const upload = require('../config/upload');
const Order = db.order;
const Product = db.product;

exports.getAllWishlish = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: {
        status: "wishlist",
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  const { user_id, product_id } = req.body;

  try {
    const existingOrder = await Order.findOne({
      where: {
        user_id: user_id,
        product_id: product_id,
        status: "wishlist",
      },
    });

    if (existingOrder) {
      return res
        .status(400)
        .json({ success: false, message: "Produk sudah ada di wishlist." });
    }

    const orderCode = await generateOrderCode();
    const orderId = await generateOrderId();
    const orderNumber = `${orderCode}${orderId}${generateDate()}`;

    // Tambahkan produk ke wishlist pengguna
    const newWishlistItem = await Order.create({
      no_order: orderNumber,
      user_id: user_id,
      product_id: product_id,
      status: "wishlist",
    });

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan ke wishlist.",
      wishlistItem: newWishlistItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const wishlistItemId = req.params.id;

  try {
    const wishlistItem = await Order.findByPk(wishlistItemId);

    if (wishlistItem && wishlistItem.status === "wishlist") {
      await wishlistItem.destroy();
      res.status(200).json({
        success: true,
        message: "Product berhasil dihapus dari wishlist.",
      });
    } else {
      res.status(404).json({
        success: false,
        message:
          "Product tidak ditemukan dalam wishlist atau sudah tidak dalam status wishlist.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal menghapus product dari wishlist: " + error.message,
    });
  }
};

exports.addToCart = async (req, res) => {
  const { user_id, product_id, address, payment_service, total_payment } =
    req.body;
  const paymentProof = req.file ? req.file.path : null;

  try {
    const status =
      user_id &&
      product_id &&
      address &&
      payment_service &&
      total_payment &&
      paymentProof
        ? "completed"
        : "on progress";

    // Jika ada file yang diunggah, simpan jalur file
    const orderCode = await generateOrderCode();
    const orderId = await generateOrderId();
    const orderNumber = `${orderCode}${orderId}${generateDate()}`;

    const newCartItem = await Order.create({
      no_order: orderNumber,
      user_id: user_id,
      product_id: product_id,
      address: address,
      status: status,
      payment_service: payment_service,
      total_payment: total_payment,
      payment_proof: paymentProof,
    });

    res.status(201).json({
      success: true,
      message: "Produk berhasil ditambahkan ke keranjang belanja.",
      cartItem: newCartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Gagal menambahkan produk ke keranjang belanja: " + error.message,
    });
  }
};

exports.updateToCart = async (req, res) => {
  const orderId = req.params.id;
  const { payment_proof } = req.body;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Pesanan tidak ditemukan." });
    }

    let updatedPaymentProof = null;
    if (req.file) {
      // Jika ada file yang diunggah, simpan path file di updatedPaymentProof
      updatedPaymentProof = req.file.path;
    }

    await order.update({
      payment_proof: updatedPaymentProof,
      status: "completed",
    });

    return res.status(200).json({
      success: true,
      message: "Keranjang belanja berhasil diperbarui.",
      updatedOrderId: orderId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui keranjang belanja: " + error.message,
    });
  }
};

exports.listCartByUserId = async (req, res) => {
  const userId = req.params.user_id;

  try {
    const order = await Order.findAll({ where: { user_id: userId } });

    return res.status(200).json({
      success: true,
      listCart: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil cart: " + error.message,
    });
  }
};

exports.detailCartByUserId = async (req, res) => {
  const orderId = req.params.order_id;

  try {
    const order = await Order.findByPk(orderId);

    return res.status(200).json({
      success: true,
      listCart: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil cart: " + error.message,
    });
  }
};

async function generateOrderCode() {
  const product = await Product.findOne();
  const category = product.category;
  const orderCode = category.slice(0, 2).toUpperCase();
  return orderCode;
}

async function generateOrderId() {
  const product = await Product.findOne({
    attributes: ["id"],
    product: [["id", "DESC"]],
    limit: 1,
  });

  if (product) {
    const orderId = product.id;
    return orderId;
  } else {
    return null;
  }
}

function generateDate() {
  const today = new Date();
  const year = today.getFullYear().toString().slice(-2);
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${day}${month}${year}`;
}
