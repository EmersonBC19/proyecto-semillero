import User from "../models/user.js";
import Transaction from "../models/transaction.js";
import Audit from "../models/auditoria.js";
import Withdrawal from "../models/withdrawals.js";
import { sequelize } from "../database/database.js";
import { Op } from "sequelize";

export const withdrawFromUser = async (req, res) => {
  console.log("Datos recibidos en el backend para retiro:", req.body);
  const { identifier, amount } = req.body; // 'identifier' puede ser cedula o accountNumber
  const ipAddress = req.ip; // Obtener la dirección IP del usuario
  const userAgent = req.get("User-Agent"); // Obtener el User-Agent del navegador o dispositivo

  // Validaciones básicas
  if (!identifier || !amount || amount <= 0) {
    return res.status(400).json({
      message:
        "El identificador y el monto son requeridos y el monto debe ser mayor a 0.",
    });
  }
  console.log("Identifier:", identifier, "Amount:", amount);
  let transaction;
  try {
    // Iniciar transacción
    transaction = await sequelize.transaction();

    // Buscar al usuario por cedula o accountNumber
    const user = await User.findOne({
      where: {
        [Op.or]: [{ cedula: identifier }, { accountNumber: identifier }],
      },
      lock: true, // Bloquear fila para transacción
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el usuario tiene fondos suficientes
    if (parseFloat(user.balance) < parseFloat(amount)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Fondos insuficientes" });
    }

    // Actualizar el saldo del usuario
    const nuevoSaldo = parseFloat(user.balance) - parseFloat(amount);
    await user.update({ balance: nuevoSaldo }, { transaction });

    // Registrar la transacción en la tabla de transacciones
    const withdrawalTransaction = await Transaction.create(
      {
        userId: user.id,
        name: user.name, // Asegúrate de que este campo esté presente en la tabla
        cedula: user.cedula, // Asegúrate de que este campo esté presente en la tabla
        amount: -amount,
        accountNumber: user.accountNumber,
        transactionType: "withdrawal",
        status: "completed",
      },
      { transaction }
    );

    // Registrar en la tabla de retiros
    await Withdrawal.create(
      {
        userId: user.id,
        cedula: user.cedula,
        amount: amount,
        accountNumber: user.accountNumber,
        status: "completed",
        timestamp: new Date(),
      },
      { transaction }
    );

    // Registrar auditoría de retiro exitoso
    await Audit.create(
      {
        userId: user.id,
        cedula: user.cedula, // Cedula del usuario
        userName: user.name, // Nombre del usuario
        transactionId: withdrawalTransaction.id,
        transactionType: "withdrawal", // Tipo de transacción
        amount: amount, // Monto retirado
        status: "completed", // Estado completado
        accountNumber: user.accountNumber, // Número de cuenta del usuario
        destinationAccount: null, // No hay cuenta de destino en el retiro
        ipAddress: ipAddress || null, // Dirección IP del usuario
        userAgent: userAgent || null, // User-Agent del navegador o dispositivo
        timestamp: new Date(), // Fecha y hora actual
      },
      { transaction }
    );

    // Confirmar la transacción
    await transaction.commit();
    return res.status(201).json({ message: "Retiro completado exitosamente" });
  } catch (error) {
    // Revertir la transacción en caso de error
    if (transaction) await transaction.rollback();
    console.error("Error en el retiro:", error.message);

    // Registrar auditoría en caso de fallo en el retiro
    try {
      await Audit.create({
        userId: null, // No hay usuario en caso de error
        cedula: identifier || "desconocido", // Cedula o identificador fallido
        userName: "desconocido",
        transactionId: null,
        transactionType: "withdrawal", // Tipo de transacción: retiro fallido
        amount: amount || 0,
        status: "failed",
        accountNumber: null, // No hay cuenta en caso de error
        destinationAccount: null, // No hay cuenta de destino en caso de error
        ipAddress: ipAddress || null, // Dirección IP del intento de retiro
        userAgent: userAgent || null, // Información del navegador o dispositivo
        details: `Fallo en el intento de retiro de ${amount}`,
        timestamp: new Date(),
      });
    } catch (auditError) {
      console.error(
        "Error al registrar la auditoría de fallo:",
        auditError.message
      );
    }

    return res.status(500).json({ message: "Error en el retiro" });
  }
};

export const getUserWithdrawals = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res
      .status(400)
      .json({ message: "Usuario no autenticado o token inválido" });
  }

  const userId = req.user.id;

  try {
    const withdrawals = await Withdrawal.findAll({
      where: { userId: userId },
      order: [["createdAt", "DESC"]],
    });

    if (withdrawals.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron retiros para este usuario" });
    }

    return res.status(200).json(withdrawals);
  } catch (error) {
    console.error("Error al obtener los retiros del usuario:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener los retiros del usuario" });
  }
};
