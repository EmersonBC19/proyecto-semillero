import app from "./app.js";
import { sequelize } from "./database/database.js";
import { createAdminUser } from "./helpers/createAdmin.js";
import "./models/user.js";
import "./models/transaction.js";
import "./models/auditoria.js";
import "./models/deposits.js";
import "./models/withdrawals.js";

async function main() {
  await createAdminUser();
  try {
    await sequelize.sync({ alter: true });
    app.listen(3000);
    console.log("Server is listening on port", 3000);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

main();
