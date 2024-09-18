import jwt from "jsonwebtoken";
import { SECRET_TOKEN } from "../config.js"; 

// Crear un token de acceso (JWT)
export function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload, // Payload contiene el id y el rol del usuario
      SECRET_TOKEN, // Clave secreta (almacenada de forma segura)
      {
        expiresIn: "1d", // Tiempo de expiración de 1 día
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}

// Verificar el token de acceso
export function verifyAccessToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_TOKEN, (err, decoded) => {
      if (err) return reject(new Error("Token inválido o expirado"));
      resolve(decoded); // Devuelve el payload decodificado si es válido
    });
  });
}
