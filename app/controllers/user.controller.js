const db = require("../models");
var bcrypt = require("bcryptjs");
const User = db.user;

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  const userId = req.params.id;
  const { username, name, email, password, phone } = req.body;

  try {    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    // Perbarui data pengguna
    user.username = username;
    user.name = name;
    user.email = email;
    user.phone = phone;

    if (password) {
      user.password = await bcrypt.hash(password, 8);
    }

    await user.save();
    res.status(200).json({ success: true, message: 'Profil pengguna berhasil diperbarui.' });
  } catch (error) {    
    res.status(500).json({ success: false, message: error.message });
  }
};