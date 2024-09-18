import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/database.js";

class Transaction extends Model {}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cedula: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    accountNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    destinationAccount: {
      type: DataTypes.STRING,
      allowNull: true, // Destination account number (for transfers)
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    transactionType: {
      type: DataTypes.ENUM("deposit", "withdrawal", "transfer", "received"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("completed", "pending", "failed"),
      defaultValue: "completed",
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Transaction",
    timestamps: true,
  }
);

export default Transaction;
