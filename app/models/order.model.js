module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("orders", {
    no_order: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
    },
    payment_service: {
      type: Sequelize.ENUM,
      values: ["JNE", "Tiki", "Pos Indo", "JNT"],
    },
    total_payment: {
      type: Sequelize.FLOAT,
    },
    status: {
      type: Sequelize.ENUM,
      values: ["wishlist", "on progress", "completed"],
    },
    payment_proof: {
      type: Sequelize.STRING
    }
  }); 

  return Order;
};
