import User from "../models/user.js";
import Transaction from "../models/transaction.js";
import Audit from "../models/auditoria.js"; // Asegúrate de que este es el modelo correcto
import Deposit from "../models/deposits.js"; // Importamos el modelo Deposit
import { sequelize } from "../database/database.js";
import { Op } from "sequelize";

export const depositToUser = async (req, res) => {
  const { identifier, amount } = req.body; // 'identifier' puede ser cedula o accountNumber
  const ipAddress = req.ip; // Obtener la dirección IP del usuario
  const userAgent = req.get("User-Agent"); // Obtener el User-Agent del navegador o dispositivo

  // Validaciones básicas
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "El monto debe ser mayor a 0" });
  }

  try {
    const transaction = await sequelize.transaction();

    try {
      // Buscar al usuario por cedula o accountNumber
      const userDestino = await User.findOne({
        where: {
          [Op.or]: [{ cedula: identifier }, { accountNumber: identifier }],
        },
        lock: true,
        transaction,
      });

      if (!userDestino) {
        await transaction.rollback();
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Actualizar saldo del usuario destino
      const nuevoSaldoDestino =
        parseFloat(userDestino.balance) + parseFloat(amount);
      await userDestino.update({ balance: nuevoSaldoDestino }, { transaction });

      // Registrar la transacción
      const depositTransaction = await Transaction.create(
        {
          userId: userDestino.id,
          name: userDestino.name, // Aseguramos que se guarde el nombre del usuario
          cedula: userDestino.cedula, // Aseguramos que se guarde la cédula del usuario
          accountNumber: userDestino.accountNumber, // Aseguramos que se guarde el número de cuenta del usuario
          amount: amount,
          transactionType: "deposit",
          status: "completed",
        },
        { transaction }
      );

      // Registrar el depósito en la tabla `Deposit` con cédula y número de cuenta
      await Deposit.create(
        {
          name: userDestino.name,
          amount: amount,
          cedula: userDestino.cedula, // Registrar la cédula del usuario
          accountNumber: userDestino.accountNumber, // Registrar el número de cuenta del usuario
          timestamp: new Date(),
        },
        { transaction }
      );

      // Registrar auditoría del depósito exitoso
      await Audit.create(
        {
          userId: userDestino.id,
          cedula: userDestino.cedula, // Cedula del usuario destino
          userName: userDestino.name, // Nombre del usuario destino
          transactionId: depositTransaction.id,
          transactionType: "deposit", // Tipo de transacción: depósito
          amount: amount, // Monto depositado
          status: "completed", // Estado completado
          accountNumber: userDestino.accountNumber, // Número de cuenta del usuario
          destinationAccount: null, // No hay cuenta de destino en un depósito
          ipAddress: ipAddress || null, // Dirección IP del usuario
          userAgent: userAgent || null, // User-Agent del navegador o dispositivo
          timestamp: new Date(), // Fecha y hora actual
        },
        { transaction }
      );

      // Confirmar la transacción
      await transaction.commit();
      return res
        .status(201)
        .json({ message: "Depósito completado exitosamente" });
    } catch (error) {
      await transaction.rollback();
      console.error("Error en el depósito:", error.message);
      return res.status(500).json({ message: "Error en el depósito" });
    }
  } catch (error) {
    console.error("Error interno del servidor:", error.message);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getUserDeposits = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res
      .status(400)
      .json({ message: "Usuario no autenticado o token inválido" });
  }

  const userId = req.user.id;

  try {
    const deposits = await Deposit.findAll({
      where: { userId: userId },
      order: [["createdAt", "DESC"]],
    });

    if (deposits.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron depósitos para este usuario" });
    }

    return res.status(200).json(deposits);
  } catch (error) {
    console.error("Error al obtener los depósitos del usuario:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener los depósitos del usuario" });
  }
};
