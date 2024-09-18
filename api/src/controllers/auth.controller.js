import User from "../models/user.js";
import crypto from "crypto";
import { createAccessToken } from "../libs/jwt.js";
import { Op } from "sequelize";

// Registrar un nuevo usuario
export const register = async (req, res) => {
  const { email, password, name, cedula, role } = req.body;

  try {
    // Verificar si el correo electrónico o la cédula ya existen
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: email }, { cedula: cedula }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({
          message: "El correo electrónico o la cédula ya están registrados",
        });
    }

    // Crear el hash de la contraseña usando SHA-256
    const passwordHash = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    // Determinar el rol por defecto si no se proporciona
    const userRole = role || "client";

    // Crear el nuevo usuario
    const newUser = new User({
      email,
      password: passwordHash,
      name,
      cedula,
      role: userRole, // Guardar el rol
    });

    const userSaved = await newUser.save();

    // Crear el token de acceso con el rol
    const token = await createAccessToken({
      id: userSaved.id,
      email: userSaved.email,
      name: userSaved.name,
      cedula: userSaved.cedula,
      role: userSaved.role,
      accountNumber: userSaved.accountNumber,
      balance: userSaved.balance,
    });

    // Establecer la cookie con el token
    res.cookie("token", token, {
      httpOnly: true, // Asegura que la cookie solo se pueda acceder desde HTTP(S)
      secure: process.env.NODE_ENV === "production", // Solo se envía en HTTPS en producción
      sameSite: "strict", // Protege contra CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 día de duración
    });

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      id: userSaved.id,
      name: userSaved.name,
      email: userSaved.email,
      cedula: userSaved.cedula,
      role: userSaved.role,
      accountNumber: userSaved.accountNumber,
      balance: userSaved.balance,
    });
  } catch (error) {
    console.error("Error registrando usuario:", error);
    res.status(500).json({ message: error.message });
  }
};

// Iniciar sesión de un usuario
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario por correo electrónico
    const userFound = await User.findOne({
      where: { email },
    });
    if (!userFound)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Crear el hash de la contraseña ingresada usando SHA-256
    const passwordHash = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    // Comparar los hashes de las contraseñas
    if (passwordHash !== userFound.password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar el token con el rol incluido
    const token = await createAccessToken({
      id: userFound.id,
      role: userFound.role,
      email: userFound.email,
      name: userFound.name,
      cedula: userFound.cedula,
      accountNumber: userFound.accountNumber,
      balance: userFound.balance,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Incluir el token en la respuesta JSON
    res.status(200).json({
      token, // Aquí se incluye el token en la respuesta JSON
      id: userFound.id,
      name: userFound.name,
      email: userFound.email,
      cedula: userFound.cedula,
      role: userFound.role,
      accountNumber: userFound.accountNumber,
      balance: userFound.balance,
    });
  } catch (error) {
    console.error("Error iniciando sesión:", error);
    res.status(500).json({ message: error.message });
  }
};

// Cerrar sesión del usuario
export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0), // Eliminar la cookie
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.sendStatus(200); // Respuesta exitosa sin contenido
};

