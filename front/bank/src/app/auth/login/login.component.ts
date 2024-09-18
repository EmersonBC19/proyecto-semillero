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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export default class LoginComponent {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private NotificationService: NotificationService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]], // Min. 6 caracteres para la contraseña
    });
  }

  // Getter para fácil acceso a los controles del formulario
  get f() {
    return this.loginForm.controls;
  }

  async onLogin(): Promise<void> {
    this.submitted = true;

    // Detener la ejecución si el formulario es inválido
    if (this.loginForm.invalid) {
      this.NotificationService.showError('Formulario no válido');
      console.error('Formulario no válido');
      return;
    }

    const loginData = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    try {
      const response = await this.authService.login(
        loginData.email,
        loginData.password
      );

      if (response) {
        localStorage.setItem('auth_token', response.token);
        if (response.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
          this.NotificationService.showSuccess('Inicio de sesión exitoso!');
        }
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      this.NotificationService.showError(
        'Error al iniciar sesión. Por favor, verifica tus credenciales.'
      );
    }
  }
}
