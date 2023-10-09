const express = require("express");
const cors = require("cors");

const app = express();

app.use('/uploads', express.static('app/uploads'));

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// // database
// const db = require("./app/models");

// db.sequelize.sync();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Api olshop-capstone-project." });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/product.routes')(app);
require('./app/routes/order.routes')(app);

const port = process.env.PORT || 9090;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}.`);
});