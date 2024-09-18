import User from "../models/user.js";
import Transaction from "../models/transaction.js";
import Audit from "../models/auditoria.js"; // Asegúrate que la ruta esté correcta
import { sequelize } from "../database/database.js";
import { Op } from "sequelize";

export const transferBetweenUsers = async (req, res) => {
  const { identifierOrigen, identifierDestino, amount } = req.body;

  if (!identifierOrigen || !identifierDestino || !amount) {
    return res.status(400).json({ message: "Faltan datos requeridos" });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: "El monto debe ser mayor a 0" });
  }

  try {
    const transaction = await sequelize.transaction();

    try {
      // Buscar al usuario origen por cedula o accountNumber
      const userOrigen = await User.findOne({
        where: {
          [Op.or]: [
            { cedula: identifierOrigen },
            { accountNumber: identifierOrigen },
          ],
        },
        lock: true,
        transaction,
      });

      // Buscar al usuario destino por cedula o accountNumber
      const userDestino = await User.findOne({
        where: {
          [Op.or]: [
            { cedula: identifierDestino },
            { accountNumber: identifierDestino },
          ],
        },
        lock: true,
        transaction,
      });

      if (!userOrigen) {
        await transaction.rollback();
        return res
          .status(404)
          .json({ message: "Usuario origen no encontrado" });
      }

      if (!userDestino) {
        await transaction.rollback();
        return res
          .status(404)
          .json({ message: "Usuario destino no encontrado" });
      }

      if (userOrigen.balance < amount) {
        await transaction.rollback();
        return res.status(400).json({ message: "Fondos insuficientes" });
      }

      // Actualizar saldos
      const nuevoSaldoOrigen =
        parseFloat(userOrigen.balance) - parseFloat(amount);
      const nuevoSaldoDestino =
        parseFloat(userDestino.balance) + parseFloat(amount);

      await userOrigen.update({ balance: nuevoSaldoOrigen }, { transaction });
      await userDestino.update({ balance: nuevoSaldoDestino }, { transaction });

      // Crear transacciones
      const origenTransaction = await Transaction.create(
        {
          userId: userOrigen.id,
          cedula: userOrigen.cedula,
          name: userOrigen.name,
          accountNumber: userOrigen.accountNumber,
          destinationAccount: userDestino.accountNumber,
          amount: -amount,
          transactionType: "transfer",
          status: "completed",
        },
        { transaction }
      );

      const destinoTransaction = await Transaction.create(
        {
          userId: userDestino.id,
          cedula: userDestino.cedula,
          name: userDestino.name,
          accountNumber: userDestino.accountNumber,
          destinationAccount: userOrigen.accountNumber,
          amount: amount,
          transactionType: "received",
          status: "completed",
        },
        { transaction }
      );

      // Registrar auditoría para usuario origen
      await Audit.create(
        {
          userId: userOrigen.id,
          cedula: userOrigen.cedula,
          userName: userOrigen.name,
          transactionId: origenTransaction.id,
          transactionType: "transfer",
          amount: amount,
          status: "completed",
          accountNumber: userOrigen.accountNumber,
          destinationAccount: userDestino.accountNumber,
          ipAddress: req.ip, // Captura la IP desde la solicitud
          userAgent: req.headers["user-agent"], // Captura el user-agent desde la solicitud
          timestamp: new Date(),
        },
        { transaction }
      );

      // Registrar auditoría para usuario destino
      await Audit.create(
        {
          userId: userDestino.id,
          cedula: userDestino.cedula,
          userName: userDestino.name,
          transactionId: destinoTransaction.id,
          transactionType: "received",
          amount: amount,
          status: "completed",
          accountNumber: userDestino.accountNumber,
          destinationAccount: userOrigen.accountNumber,
          ipAddress: req.ip, // Captura la IP desde la solicitud
          userAgent: req.headers["user-agent"], // Captura el user-agent desde la solicitud
          timestamp: new Date(),
        },
        { transaction }
      );

      await transaction.commit();
      return res
        .status(201)
        .json({ message: "Transferencia completada exitosamente" });
    } catch (error) {
      await transaction.rollback();
      console.error("Error en la transacción interna:", error);
      return res.status(500).json({ message: "Error en la transacción" });
    }
  } catch (error) {
    console.error("Error interno del servidor:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getUserTransactions = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res
      .status(400)
      .json({ message: "Usuario no autenticado o token inválido" });
  }

  const userId = req.user.id;

  try {
    const transactions = await Transaction.findAll({
      where: { userId: userId },
      order: [["createdAt", "DESC"]], // Ordenar por fecha descendente
    });

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron transacciones para este usuario" });
    }

    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Error al obtener las transacciones del usuario:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener las transacciones del usuario" });
  }
};
