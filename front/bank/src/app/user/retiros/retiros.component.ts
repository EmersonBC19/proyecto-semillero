import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import Toastify from 'toastify-js';
import { TransactionService } from '../../core/services/transaction.service';
import { AuthService } from '../../core/services/auth.service';
import TableComponent from "../../shared/components/table/table.component";

@Component({
  selector: 'app-retiros',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, TableComponent],
  templateUrl: './retiros.component.html',
  styleUrls: ['./retiros.component.css'],
})
export default class RetirosComponent implements OnInit {
  withdrawalForm: FormGroup;
  message: string = '';
  userCedula: string = ''; // Cédula del usuario logueado
  userAccountNumber: string = ''; // Número de cuenta del usuario logueado

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private authService: AuthService
  ) {
    this.withdrawalForm = this.createWithdrawalForm();
  }

  ngOnInit(): void {
    this.initializeUserData();
  }

  private createWithdrawalForm(): FormGroup {
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
    if (this.withdrawalForm.valid) {
      const amount = this.withdrawalForm.get('amount')?.value;

      const formData = {
        identifier: this.userCedula, // Se toma la cédula del usuario logueado
        amount: amount,
      };
      console.log('Datos enviados al backend para retiro:', formData);

      try {
        const response = await this.transactionService.withdraw(formData);

        if (response && response.message) {
          Toastify({
            text: 'Retiro realizado con éxito!',
            duration: 3000,
            close: true,
            gravity: 'bottom',
            position: 'right',
            backgroundColor: 'linear-gradient(to right, #03A64A, #0CF25D)',
            stopOnFocus: true,
          }).showToast();
          this.withdrawalForm.reset();
        } else {
          this.message =
            'Retiro realizado, pero no se recibió una respuesta clara del servidor.';
          this.withdrawalForm.reset();
        }
      } catch (error: any) {
        console.error('Error en el retiro:', error);
        Toastify({
          text: 'Error en el retiro!',
          duration: 3000,
          close: true,
          gravity: 'bottom',
          position: 'right',
          backgroundColor: 'linear-gradient(to right, #F23030, #F28705)',
          stopOnFocus: true,
        }).showToast();

        this.message =
          'Ocurrió un error durante el retiro. Por favor, inténtalo de nuevo.';
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
  }
}
