import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'http://localhost:3000/api';
  private apiUrlTransactions = 'http://localhost:3000/api/transactions';

  public transactionCompletedSource = new Subject<void>();

  transactionCompleted$ = this.transactionCompletedSource.asObservable();

  constructor(private authService: AuthService) {}

  // Método para realizar la transferencia entre usuarios
  async transfer(data: any): Promise<any> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Usuario no autenticado');
      }
      const userData = await this.authService.getUserData();

      if (!userData) {
        throw new Error('No se pudieron obtener los datos del usuario');
      }

      if (!data.senderCedula) {
        data.senderCedula = userData.cedula;
      }

      if (!data.senderAccountNumber) {
        data.senderAccountNumber = userData.accountNumber;
      }

      const response = await axios.post(`${this.apiUrl}/transfer`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.transactionCompletedSource.next();
      return response.data;
    } catch (error) {
      console.error('Error en la transferencia:', error);
      throw error;
    }
  }

  async withdraw(data: any): Promise<any> {
    try {
      const token = this.getToken();
      const userData = await this.authService.getUserData();

      if (!userData) {
        throw new Error('No se pudieron obtener los datos del usuario');
      }

      if (!data.identifierOrigen) {
        data.identifierOrigen = userData.cedula;
      }

      if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
        throw new Error('El monto es inválido');
      }

      const response = await axios.post(`${this.apiUrl}/withdrawal`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.transactionCompletedSource.next();
      return response.data;
    } catch (error) {
      console.error('Error en el retiro:', error);
      throw error;
    }
  }

  async deposit(data: any): Promise<any> {
    try {
      const token = this.getToken();
      const userData = await this.authService.getUserData();

      if (!userData) {
        throw new Error('No se pudieron obtener los datos del usuario');
      }

      if (!data.identifierDestino) {
        data.identifierDestino = userData.cedula;
      }

      if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
        throw new Error('El monto es inválido');
      }

      const response = await axios.post(`${this.apiUrl}/deposit`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.transactionCompletedSource.next();
      return response.data;
    } catch (error) {
      console.error('Error en el depósito:', error);
      throw error;
    }
  }

  private getToken(): string | null {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Usuario no autenticado');
    }
    return token;
  }

  async getUserTransactions(): Promise<AxiosResponse<any>> {
    try {
      const token = this.getToken();

      const response = await axios.get(
        `${this.apiUrlTransactions}/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error('Error al obtener transacciones', error);
      throw error;
    }
  }

  async getUserWithdrawals(): Promise<AxiosResponse<any>> {
    try {
      const token = this.getToken();

      const response = await axios.get(
        `${this.apiUrlTransactions}/withdrawals`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error('Error al obtener retiros', error);
      throw error;
    }
  }

  async getUserDeposits(): Promise<AxiosResponse<any>> {
    try {
      const token = this.getToken();

      const response = await axios.get(`${this.apiUrlTransactions}/deposits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error al obtener depósitos', error);
      throw error;
    }
  }
}
