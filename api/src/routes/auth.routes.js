import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import { authRequired, roleRequired } from "../middlewares/authMidelware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", authRequired, logout);

// Rutas protegidas por autenticación
router.get("/profile", authRequired, (req, res) => {
  res.status(200).json({ message: `Bienvenido, ${req.user.id}` });
});

// Rutas protegidas por roles
router.get(
  "/admin-dashboard",
  authRequired,
  roleRequired("admin"),
  (req, res) => {
    res.status(200).json({ message: "Panel de administración" });
  }
);

export default router;
