import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TarjetaComponent } from '../../shared/components/tarjeta/tarjeta.component';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import ModalComponent from '../../shared/components/modal/modal.component';
import { TransactionService } from '../../core/services/transaction.service';
import { ResourceLoader } from '@angular/compiler';

interface UltimosMovimientos {
  transferencia: number | null;
  retiro: number | null;
  deposito: number | null;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, TarjetaComponent, CommonModule, ModalComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export default class ProfileComponent {
  // Cambia "default" a "export class ProfileComponent"
  userData: any = {
    name: '',
    cedula: '',
    email: '',
    accountNumber: '',
    amount: 0,
  };
  ultimosMovimientos: UltimosMovimientos = {
    transferencia: null,
    retiro: null,
    deposito: null,
  };

  isModalOpen = false;

  // Método para abrir el modal
  modalView: 'transactions' | 'deposit' | 'withdrawal' | null = null; // Controla qué vista mostrar

  // Método para abrir el modal con la vista correspondiente
  openModal(view: 'transactions' | 'deposit' | 'withdrawal') {
    this.modalView = view;
    this.isModalOpen = true;
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
    this.modalView = null; // Resetea la vista al cerrar el modal
    this.loadUserData();
  }

  constructor(
    private authService: AuthService,
    private TransactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadUltimosMovimientos();
  }

  async loadUserData() {
    try {
      const data = await this.authService.getUserData();
      if (data) {
        this.userData = data; // Guardamos todos los datos obtenidos, incluido el amount
      } else {
        console.error('No se pudieron obtener los datos del usuario.');
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  }

  handleModalClose() {
    this.isModalOpen = false;
    this.loadUserData();
  }

  async loadUltimosMovimientos() {
    try {
      const response = await this.TransactionService.getUserTransactions(); // Obtén la respuesta del servicio
      const transacciones: any[] = response.data; // Asegúrate de tipar las transacciones correctamente

      // Variables para almacenar las últimas transacciones
      let ultimaTransferencia = null;
      let ultimoRetiro = null;
      let ultimoDeposito = null;

      // Filtrar solo las transacciones de tipo 'transfer' (transferencia)
      const transferencias = transacciones.filter(
        (transaccion: any) => transaccion.transactionType === 'transfer'
      );

      // Filtrar solo las transacciones de tipo 'withdrawal' (retiro)
      const retiros = transacciones.filter(
        (transaccion: any) => transaccion.transactionType === 'withdrawal'
      );

      // Filtrar solo las transacciones de tipo 'deposit' (depósito)
      const depositos = transacciones.filter(
        (transaccion: any) => transaccion.transactionType === 'deposit'
      );

      // Obtener la transferencia más reciente
      if (transferencias.length > 0) {
        ultimaTransferencia = transferencias[0]; // La más reciente de las transferencias
      }

      // Obtener el retiro más reciente
      if (retiros.length > 0) {
        ultimoRetiro = retiros[0]; // El más reciente de los retiros
      }

      // Obtener el depósito más reciente
      if (depositos.length > 0) {
        ultimoDeposito = depositos[0]; // El más reciente de los depósitos
      }

      // Guardamos solo los montos de las transacciones más recientes dependiendo de su tipo
      this.ultimosMovimientos = {
        transferencia: ultimaTransferencia ? ultimaTransferencia.amount : null,
        retiro: ultimoRetiro ? ultimoRetiro.amount : null,
        deposito: ultimoDeposito ? ultimoDeposito.amount : null,
      };
    } catch (error) {
      console.error('Error al cargar los últimos movimientos:', error);
    }
  }
}
