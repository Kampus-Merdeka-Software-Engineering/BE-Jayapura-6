module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("product", {
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
  });

  return Product;
};