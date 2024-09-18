import Sequelize from "sequelize";

export const sequelize = new Sequelize("banco", "postgres", "admin", {
  host: "localhost",
  dialect: "postgres",
  port: 5433,
});

export default sequelize;
