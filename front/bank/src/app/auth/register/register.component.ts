import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import 'toastify-js/src/toastify.css';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export default class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async registerUser(): Promise<void> {
    if (this.registerForm.valid) {
      const registerData = {
        name: this.registerForm.get('name')?.value,
        cedula: this.registerForm.get('cedula')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
      };

      try {
        const response = await this.authService.register(registerData);

        if (response.success) {
          this.notificationService.showSuccess('Registro exitoso!');
          this.router.navigate(['/auth/login']);
        } else {
          console.error('Error en el registro:', response.message);
          this.notificationService.showError('Error en el registro!');
        }
      } catch (error) {
        console.error('Error al registrar:', error);
        this.notificationService.showError(
          'Error al registrar. Por favor, inténtalo de nuevo más tarde.'
        );
      }
    } else {
      console.error('Formulario no válido');
      this.notificationService.showError('Formulario no válido');
    }
  }
}
