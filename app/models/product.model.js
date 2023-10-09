module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("product", {
    productName: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.TEXT
    },
    category: {
      type: Sequelize.ENUM,
      values: ['clothes', 'bag', 'belt', 'hat', 'pants', 'shoes']
    },
    price: {
      type: Sequelize.FLOAT
    },  
  }, {
    freezeTableName: true,
    timestamps: false
});

  return Product;
};