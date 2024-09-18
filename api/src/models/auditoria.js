import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

class Audit extends Model {}

Audit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Reference to the user who performed the transaction
    },
    cedula: {
      type: DataTypes.STRING(20),
      allowNull: false, // User's ID number (similar to "cedula")
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false, // Stores the user's full name
    },
    transactionId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Reference to the related transaction
    },
    transactionType: {
      type: DataTypes.ENUM("deposit", "withdrawal", "transfer", "received"),
      allowNull: false, // Specifies if it's a deposit, withdrawal, or transfer
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false, // Amount involved in the transaction
    },
    status: {
      type: DataTypes.ENUM(
        "completed",
        "pending",
        "failed",
        "denied",
        "cancelled",
        "server_error"
      ),
      allowNull: false,
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: true, // Source account number (for transfers)
    },
    destinationAccount: {
      type: DataTypes.STRING,
      allowNull: true, // Destination account number (for transfers)
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true, // IP address of the user at the time of the transaction
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true, // Information about the browser or device used
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Audit",
    tableName: "audits", // Table name in plural
    timestamps: false, // Disable 'createdAt' and 'updatedAt' columns
  }
);

export default Audit;
