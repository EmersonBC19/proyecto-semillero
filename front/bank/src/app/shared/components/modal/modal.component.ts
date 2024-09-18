import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import TransactionsComponent from '../../../user/transactions/transactions.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { NotificationService } from '../../../core/services/notification.service';
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    TransactionsComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export default class ModalComponent implements OnInit {
  @Input() isModalOpen: boolean = false;
  @Input() modalView: 'transactions' | 'deposit' | 'withdrawal' | null = null;
  @Output() modalClose = new EventEmitter<void>();

  withdrawalForm: FormGroup;
  depositForm: FormGroup;
  transferForm: FormGroup;
  message: string = '';
  userCedula: string = '';
  userAccountNumber: string = '';

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.transferForm = this.createTransferForm();
    this.depositForm = this.createAmountForm(); // Uso del método genérico
    this.withdrawalForm = this.createAmountForm(); // Uso del método genérico
  }

  // Método para cargar transacciones
  async loadTransactions(): Promise<void> {
    try {
      const response = await this.transactionService.getUserTransactions();
      this.loadTransactions = response.data; // Suponiendo que 'data' contiene las transacciones
    } catch (error) {
      this.notificationService.showError('Error al cargar transacciones.');
    }
  }

  // Método para cargar depósitos
  async loadDeposits(): Promise<void> {
    try {
      const response = await this.transactionService.getUserDeposits();
      this.loadDeposits = response.data; // Suponiendo que 'data' contiene los depósitos
    } catch (error) {
      this.notificationService.showError('Error al cargar depósitos.');
    }
  }

  // Crear un formulario genérico para amount (retiros y depósitos)
  private createAmountForm(): FormGroup {
    return this.fb.group({
      amount: [
        0,
        [
          Validators.required,
          Validators.min(10000),
          Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'),
        ],
      ],
    });
  }

  // Crear formulario específico para transferencias
  private createTransferForm(): FormGroup {
    return this.fb.group({
      identifierDestino: ['', Validators.required],
      amount: [
        0,
        [
          Validators.required,
          Validators.min(10000),
          Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.initializeUserData();
    this.loadTransactions();
    this.loadDeposits();
  }

  // Unificar la lógica de inicialización de datos de usuario
  private async initializeUserData(): Promise<void> {
    try {
      const userData = await this.authService.getUserData();
      if (userData) {
        this.userCedula = userData.cedula;
        this.userAccountNumber = userData.accountNumber;
      }
    } catch (error) {
      this.notificationService.showError(
        'Error al obtener los datos del usuario.'
      );
      this.message = 'No se pudieron obtener los datos del usuario.';
    }
  }

  private handleSuccess(message: string) {
    this.notificationService.showSuccess(message);
    this.closeModal(); // Cerrar el modal
  }
  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
    this.modalView = null;
    this.modalClose.emit(); // Emite el evento hacia el padre para notificar el cierre
  }

  async onSubmit(): Promise<void> {
    if (this.transferForm.valid) {
      const identifierDestino =
        this.transferForm.get('identifierDestino')?.value;
      const amount = this.transferForm.get('amount')?.value;
      if (
        identifierDestino === this.userCedula ||
        identifierDestino === this.userAccountNumber
      ) {
        this.notificationService.showError(
          'No puedes enviar una transferencia a ti mismo.'
        );
        return;
      }

      const formData = {
        identifierOrigen: this.userCedula,
        identifierDestino: identifierDestino,
        amount: amount,
      };

      try {
        const response = await this.transactionService.transfer(formData);
        if (response && response.message) {
          this.handleSuccess('Transferencia realizada con éxito!');
          this.transferForm.reset();
          const updatedAmount = await this.authService.getUserData();
          if (updatedAmount !== null) {
            // Emitir el evento para cerrar el modal y notificar al padre
            this.modalClose.emit();
          }
        }
      } catch (error: any) {
        this.notificationService.showError('Error en la transferencia!');
      }
    } else {
      this.notificationService.showError('Formulario no válido, el monto debe ser mayor a 10000!');
    }
  }

  async onSubmitdeposit(): Promise<void> {
    if (this.depositForm.valid) {
      const amount = this.depositForm.get('amount')?.value;

      const formData = {
        identifier: this.userCedula,
        amount: amount,
      };

      try {
        const response = await this.transactionService.deposit(formData);
        if (response && response.message) {
          this.handleSuccess('Depósito realizado con éxito!');
          this.depositForm.reset();
        }
      } catch (error: any) {
        this.notificationService.showError('Error en el depósito!');
      }
    } else {
      this.notificationService.showError(
        'Formulario no válido, el monto debe ser mayor a 0'
      );
    }
  }

  async onSubmitRetiro(): Promise<void> {
    if (this.withdrawalForm.valid) {
      const amount = this.withdrawalForm.get('amount')?.value;

      const formData = {
        identifier: this.userCedula,
        amount: amount,
      };

      try {
        const response = await this.transactionService.withdraw(formData);
        if (response && response.message) {
          this.handleSuccess('Retiro realizado con éxito!');
          this.withdrawalForm.reset();
        }
      } catch (error: any) {
        this.notificationService.showError('Error en el retiro!');
      }
    } else {
      this.notificationService.showError('Formulario no válido!');
    }
  }
}
