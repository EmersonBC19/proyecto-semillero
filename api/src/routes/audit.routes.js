import { Router } from "express";
import { getUserAudits, getUsers } from "../controllers/audit.controller.js";

const router = Router();

router.get("/audits", getUserAudits);
router.get("/users", getUsers);

export default router;
