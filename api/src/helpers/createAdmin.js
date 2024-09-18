import User from "../models/user.js";
import crypto from "crypto";

export const createAdminUser = async () => {
  try {
    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin";
    const adminRole = "admin";

    // Buscar si ya existe un usuario administrador con ese correo
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      // Crear el hash de la contraseña
      const passwordHash = crypto
        .createHash("sha256")
        .update(adminPassword)
        .digest("hex");

      // Crear el usuario administrador
      const adminUser = await User.create({
        email: adminEmail,
        password: passwordHash,
        name: "Administrator",
        cedula: "0000000000", // Cédula de ejemplo
        role: adminRole,
      });

      console.log(`Administrador creado: ${adminUser.email}`);
    } else {
      console.log("El usuario administrador ya existe.");
    }
  } catch (error) {
    console.error("Error al crear el usuario administrador:", error);
  }
};
