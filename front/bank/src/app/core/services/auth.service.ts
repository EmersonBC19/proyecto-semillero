import axios from 'axios';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { StorageService } from './storage-service.service';
import { Router } from '@angular/router';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // URL de tu API

  constructor(private storageService: StorageService, private router: Router) {}

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, {
        email,
        password,
      });

      if (response.data && response.data.token) {
        this.storeToken(response.data.token); // Almacena el token si está presente
        return response.data;
      } else {
        console.error('No se recibió token en la respuesta:', response.data);
        return null;
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      throw error;
    }
  }

  async register(userData: any): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Obtener el token de autenticación desde localStorage
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Token no encontrado, no se puede cerrar sesión');
      }

      // Hacer la solicitud de cierre de sesión con el token en los headers
      await axios.post(
        `${this.apiUrl}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Eliminar el token del localStorage
      localStorage.removeItem('auth_token');

      // Redirigir al usuario a la página de inicio de sesión
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Manejo de errores adicionales si es necesario
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) {
          console.error('El payload del token está vacío o es inválido.');
          return null;
        }

        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const padding = '='.repeat((4 - (base64.length % 4)) % 4);
        const base64WithPadding = base64 + padding;

        const payloadJson = atob(base64WithPadding);
        const payload = JSON.parse(payloadJson);
        return payload.role;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }
  private storeToken(token: string): void {
    this.storageService.setItem('auth_token', token);
  }

  private getToken(): string | null {
    return this.storageService.getItem('auth_token');
  }

  private clearToken(): void {
    localStorage.removeItem('auth_token');
  }

  async getUserData(): Promise<any> {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      console.warn('No se encontró el token JWT en localStorage.');
      return null;
    }

    try {
      // Verifica que el token tenga las tres partes necesarias
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Formato de token JWT inválido.');
      }

      // Decodificación del payload
      const payloadBase64 = tokenParts[1];
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const padding = '='.repeat((4 - (base64.length % 4)) % 4);
      const base64WithPadding = base64 + padding;

      const payloadJson = atob(base64WithPadding);
      const payload = JSON.parse(payloadJson);

      // Verificar que los campos necesarios existen en el payload
      const requiredFields = [
        'cedula',
        'name',
        'role',
        'id',
        'email',
        'accountNumber',
        'balance',
      ];
      const missingFields = requiredFields.filter((field) => !payload[field]);

      if (missingFields.length > 0) {
        throw new Error(
          `Faltan los siguientes campos en el token JWT: ${missingFields.join(
            ', '
          )}`
        );
      }

      // Retornar los datos del usuario
      return {
        cedula: payload.cedula,
        name: payload.name,
        role: payload.role,
        id: payload.id,
        email: payload.email,
        accountNumber: payload.accountNumber,
        amount: payload.amount || payload.balance || 0,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al decodificar el token JWT:', error.message);
      } else {
        console.error('Error desconocido al decodificar el token JWT:', error);
      }
      return null;
    }
  }
}
