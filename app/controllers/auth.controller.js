const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    res.status(201).json({ success: true, message: "Berhasil Registrasi !" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).send({ success: false, message: "User tidak ditemukan." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        success: false,
        message: "Password salah !",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: "60s",
      // expiresIn: 86400,
    });

    return res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// exports.signout = async (req, res) => {
//   try {
//     req.headers["x-access-token"];

//     res.status(200).send({
//       message: "Anda berhasil keluar!"
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({
//       message: "Terjadi kesalahan saat mencoba keluar."
//     });
//   }
// };

const disabledTokens = [];
exports.signout = (req, res) => {
  try {
    const token = req.headers["authorization"];
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Token tidak valid." });
    }

    const authToken = token.slice(7);

    jwt.verify(authToken, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: "Token tidak valid." });
      }

      // Periksa apakah token sudah dinonaktifkan
      if (disabledTokens.includes(authToken)) {
        return res.status(401).json({ success: false, message: "Token sudah dinonaktifkan." });
      }
      disabledTokens.push(authToken);

      res.status(200).json({ success: true, message: "Anda berhasil logout." });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan saat mencoba logout." });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "Email tidak terdaftar." });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    user.password = hashedPassword;

    await user.save();
    return res.status(200).json({
      success: true,
      message: `Kata sandi baru telah dibuat !`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};
