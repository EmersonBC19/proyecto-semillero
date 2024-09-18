import User from "./user.js";
import Transaction from "./transaction.js";
import Deposit from "./deposits.js";
import Withdrawal from "./withdrawals.js";

const setupAssociations = () => {
  // Relación de User y Transaction
  User.hasMany(Transaction, {
    foreignKey: "userId",
    sourceKey: "id",
  });

  Transaction.belongsTo(User, {
    foreignKey: "userId",
    targetKey: "id",
  });

  // Relación de 1 User a muchos Deposits
  User.hasMany(Deposit, {
    foreignKey: "cedula",
    sourceKey: "cedula",
  });

  // Relación de muchos Deposits a 1 User
  Deposit.belongsTo(User, {
    foreignKey: "cedula",
    targetKey: "cedula",
  });

  // Relación de 1 User a muchos Withdrawals
  User.hasMany(Withdrawal, {
    foreignKey: "cedula",
    sourceKey: "cedula",
  });

  // Relación de muchos Withdrawals a 1 User
  Withdrawal.belongsTo(User, {
    foreignKey: "cedula",
    targetKey: "cedula",
  });
};

export default setupAssociations;
