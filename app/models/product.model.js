module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("products", {
    name: {
      type: Sequelize.STRING
    },
    category: {
      type: Sequelize.ENUM,
      values: ['clothes', 'bag', 'belt', 'hat', 'pants', 'shoes']
    },
    price: {
      type: Sequelize.FLOAT
    },
    price_discount: {
      type: Sequelize.FLOAT
    },
    rating: {
      type: Sequelize.INTEGER
    },    
  });

  return Product;
};