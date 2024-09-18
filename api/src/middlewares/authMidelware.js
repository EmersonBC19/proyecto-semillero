import { verifyAccessToken } from "../libs/jwt.js";

// Middleware para verificar si el usuario está autenticado
export async function authRequired(req, res, next) {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Obtener el token desde las cookies o el header

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decoded = await verifyAccessToken(token); // Verificar el token
    req.user = decoded; // Almacenar el payload decodificado en req.user

    next(); // Continuar al siguiente middleware o controlador
  } catch (err) {
    return res.status(403).json({ message: err.message });
  }
}

// Middleware para verificar si el usuario tiene un rol específico
export function roleRequired(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No estás autenticado" });
    }

    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient privileges" });
    }

    next(); // Si el rol es correcto, continuar al siguiente middleware o controlador
  };
}
