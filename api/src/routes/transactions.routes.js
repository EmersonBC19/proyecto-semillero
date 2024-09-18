import express from "express";
import { transferBetweenUsers, getUserTransactions } from "../controllers/transferUsers.controller.js";
import { depositToUser, getUserDeposits } from "../controllers/deposit.controller.js";
import { withdrawFromUser, getUserWithdrawals } from "../controllers/withdrawal.controller.js";
import { authRequired } from "../middlewares/authMidelware.js";

const router = express.Router();

router.post("/transfer", transferBetweenUsers);
router.post("/deposit", depositToUser);
router.post("/withdrawal", withdrawFromUser);

router.get("/transactions/:userId", authRequired, getUserTransactions);
router.get("/deposits", authRequired, getUserDeposits);
router.get("/withdrawals", authRequired, getUserWithdrawals);



export default router;
