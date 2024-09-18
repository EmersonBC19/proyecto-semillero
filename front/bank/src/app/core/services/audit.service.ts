import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private apiUrl = 'http://localhost:3000/audit'; // Cambia esta URL según sea necesario

  // Método para obtener los registros de auditoría
  async getUserAudits(): Promise<AxiosResponse<any>> {
    const token = localStorage.getItem('auth_token'); // Obtener el token desde localStorage
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.get(`${this.apiUrl}/audits`, {
      headers: {
        Authorization: `Bearer ${token}`, // Enviar el token en los headers
      },
    });

    return response; // Devolver los datos obtenidos
  }

  async getUsers(): Promise<AxiosResponse<any>> {
    const token = localStorage.getItem('auth_token'); // Obtener el token desde localStorage
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    const response = await axios.get(`${this.apiUrl}/users`, {
      headers: {
        Authorization: `Bearer ${token}`, // Enviar el token en los headers
      },
    });
    return response; // Devolver los datos obtenidos
  }
}
