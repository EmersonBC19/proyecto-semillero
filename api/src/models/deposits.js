import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

class Deposit extends Model {}

Deposit.init(
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cedula: {
      type: DataTypes.STRING(20), // Cédula del usuario
      allowNull: true, // No permite valores null
    },
    accountNumber: {
      type: DataTypes.STRING(20), // Número de cuenta del usuario
      allowNull: true, // No permite valores null
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Deposit",
    tableName: "deposits",
    timestamps: false,
  }
);

export default Deposit;
