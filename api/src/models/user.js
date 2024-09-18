import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/database.js";

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cedula: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 1000000,
    },
    accountNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM("admin", "client"), // Roles disponibles
      allowNull: false,
      defaultValue: "client", // El rol por defecto es 'client'
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true,
    hooks: {
      beforeCreate: (user) => {
        // Generar un número de cuenta aleatorio de 12 dígitos
        user.accountNumber =
          Math.floor(Math.random() * 900000000000) + 100000000000;
      },
    },
  }
);

export default User;
