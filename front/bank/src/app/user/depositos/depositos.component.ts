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

@Component({
  selector: 'app-deposits',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, TableComponent],
  templateUrl: './depositos.component.html',
  styleUrls: ['./depositos.component.css'],
})
export default class DepositsComponent {
  /*depositForm: FormGroup;
  message: string = '';
  userCedula: string = ''; // Cédula del usuario logueado
  userAccountNumber: string = ''; // Número de cuenta del usuario logueado

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private authService: AuthService
  ) {
    this.depositForm = this.createDepositForm();
  }

  ngOnInit(): void {
    this.initializeUserData();
    this.loadDeposits();
  }

  async loadDeposits(): Promise<void> {
    try {
      const response = await this.transactionService.getUserDeposits();
      // Asumiendo que `getUserDeposits` obtiene los depósitos realizados por el usuario.
      // Aquí puedes manejar la respuesta de la misma manera que lo hacías con `loadTransactions`.
    } catch (error) {
      console.error('Error al obtener depósitos', error);
    }
  }

  private createDepositForm(): FormGroup {
    return this.fb.group({
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
        this.userAccountNumber = userData.accountNumber;
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
    if (this.depositForm.valid) {
      const amount = this.depositForm.get('amount')?.value;

      const formData = {
        identifier: this.userCedula, // Se toma la cédula del usuario logueado
        amount: amount,
      };

      try {
        const response = await this.transactionService.deposit(formData);

        if (response && response.message) {
          Toastify({
            text: 'Depósito realizado con éxito!',
            duration: 3000,
            close: true,
            gravity: 'bottom',
            position: 'right',
            backgroundColor: 'linear-gradient(to right, #03A64A, #0CF25D)',
            stopOnFocus: true,
          }).showToast();
          this.depositForm.reset();
        } else {
          this.message =
            'Depósito realizado, pero no se recibió una respuesta clara del servidor.';
          this.depositForm.reset();
        }
      } catch (error: any) {
        console.error('Error en el depósito:', error);
        Toastify({
          text: 'Error en el depósito!',
          duration: 3000,
          close: true,
          gravity: 'bottom',
          position: 'right',
          backgroundColor: 'linear-gradient(to right, #F23030, #F28705)',
          stopOnFocus: true,
        }).showToast();

        this.message =
          'Ocurrió un error durante el depósito. Por favor, inténtalo de nuevo.';
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
