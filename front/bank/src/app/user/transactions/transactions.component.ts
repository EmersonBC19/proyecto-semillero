import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TransactionService } from '../../core/services/transaction.service';
import { AuthService } from '../../core/services/auth.service';
import Toastify from 'toastify-js';
import TableComponent from '../../shared/components/table/table.component';
import { TarjetaComponent } from '../../shared/components/tarjeta/tarjeta.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TableComponent,
    TarjetaComponent,
  ],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export default class TransactionsComponent {
  /*transferForm: FormGroup;
  message: string = '';
  userCedula: string = ''; // Cédula del usuario logueado
  userAccountNumber: string = ''; // Número de cuenta del usuario logueado

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private authService: AuthService
  ) {
    this.transferForm = this.createTransferForm();
  }

  ngOnInit(): void {
    this.initializeUserData();
    this.loadTransactions();
  }

  async loadTransactions(): Promise<void> {
    try {
      const response = await this.transactionService.getUserTransactions();
      this.loadTransactions = response.data;
    } catch (error) {
      console.error('Error al obtener transacciones', error);
    }
  }

  private createTransferForm(): FormGroup {
    return this.fb.group({
      identifierDestino: ['', Validators.required], // Solo se requiere la cédula del destinatario
      amount: [
        0,
        [
          Validators.required,
          Validators.min(0.01),
          Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'), // Asegura formato de número decimal
        ],
      ], // Validación para un monto mínimo mayor a 0
    });
  }

  private async initializeUserData(): Promise<void> {
    try {
      const userData = await this.authService.getUserData();
      if (userData) {
        this.userCedula = userData.cedula;
        this.userAccountNumber = userData.accountNumber; // Asignar número de cuenta si lo tienes
      }
    } catch (error) {
      Toastify({
        text: 'Error al obtener los datos del usuario.',
        duration: 3000,
        close: true,
        gravity: 'bottom',
        position: 'right',
        backgroundColor: 'linear-gradient(to right, #F23030, #F28705)',
        stopOnFocus: true,
      }).showToast();
      this.message = 'No se pudieron obtener los datos del usuario.';
    }
  }

  async onSubmit(): Promise<void> {
    if (this.transferForm.valid) {
      const identifierDestino =
        this.transferForm.get('identifierDestino')?.value;
      const amount = this.transferForm.get('amount')?.value;

      // Verificar si el destinatario es el mismo que el remitente
      if (
        identifierDestino === this.userCedula ||
        identifierDestino === this.userAccountNumber
      ) {
        Toastify({
          text: 'No puedes enviar una transferencia a ti mismo.',
          duration: 3000,
          close: true,
          gravity: 'bottom',
          position: 'right',
          backgroundColor: 'linear-gradient(to right, #F23030, #F28705)',
          stopOnFocus: true,
        }).showToast();
        return; // Detener el proceso si el destinatario es el usuario logueado
      }

      const formData = {
        identifierOrigen: this.userCedula,
        identifierDestino: identifierDestino,
        amount: amount,
      };
      try {
        const response = await this.transactionService.transfer(formData);

        // Verifica que la respuesta y el mensaje estén presentes
        if (response && response.message) {
          Toastify({
            text: 'Transferencia realizada con exito!',
            duration: 3000,
            close: true,
            gravity: 'bottom',
            position: 'right',
            backgroundColor: 'linear-gradient(to right, #03A64A, #0CF25D)',
            stopOnFocus: true,
          }).showToast();
          this.transferForm.reset();
        } else {
          this.message =
            'Transferencia realizada, pero no se recibió una respuesta clara del servidor.';
          this.transferForm.reset();
        }
      } catch (error: any) {
        console.error('Error en la transferencia:', error);
        Toastify({
          text: 'Error en la transferencia!',
          duration: 3000,
          close: true,
          gravity: 'bottom',
          position: 'right',
          backgroundColor: 'linear-gradient(to right, #F23030, #F28705)',
          stopOnFocus: true,
        }).showToast();

        // Mensaje genérico para cualquier tipo de error
        this.message =
          'Ocurrió un error durante la transferencia. Por favor, inténtalo de nuevo.';
      }
    } else {
      Toastify({
        text: 'Formulario no válido!',
        duration: 3000,
        close: true,
        gravity: 'bottom',
        position: 'right',
        backgroundColor: 'linear-gradient(to right, #F23030, #F28705)',
        stopOnFocus: true,
      }).showToast();
    }
  }*/
}
