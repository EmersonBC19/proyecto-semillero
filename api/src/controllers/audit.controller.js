import Audit from "../models/auditoria.js";
import User from "../models/user.js";

export const getUserAudits = async (req, res) => {
  try {
    // Obtener todos los registros de auditoría
    const audits = await Audit.findAll({
      order: [["timestamp", "DESC"]], // Ordenar por fecha descendente
    });

    // Si no hay registros
    if (audits.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron registros de auditoría" });
    }

    // Enviar los registros de auditoría
    return res.status(200).json(audits);
  } catch (error) {
    console.error("Error al obtener los registros de auditoría:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener los registros de auditoría" });
  }
};

export const getUsers = async (req, res) => {
  try {
    // Obtener todos los usuarios
    const users = await User.findAll({
      order: [["createdAt", "DESC"]], // Ordenar por fecha de creación descendente
    });

    // Si no hay usuarios
    if (users.length === 0) {
      return res.status(404).json({ message: "No se encontraron usuarios" });
    }

    // Enviar los usuarios
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};
