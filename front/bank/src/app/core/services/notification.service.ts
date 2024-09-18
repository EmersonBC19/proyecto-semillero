import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import Toastify from 'toastify-js';
import { TransactionService } from './transaction.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  showError(message: string) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'bottom',
      position: 'right',
      backgroundColor: 'linear-gradient(to right, #F23030, #F28705)',
      stopOnFocus: true,
    }).showToast();
  }

  showSuccess(message: string) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'bottom',
      position: 'right',
      backgroundColor: 'linear-gradient(to right, #03A64A, #0CF25D)',
      stopOnFocus: true,
    }).showToast();
  }
}

// Usar el servicio en tu componente

