
const adminAuth = (req, res, next) => {
  const userRole = req.user.role; // Verifica el rol del usuario

  if (userRole === "admin") {
    next(); // Continúa si el usuario es administrador
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

export default adminAuth;