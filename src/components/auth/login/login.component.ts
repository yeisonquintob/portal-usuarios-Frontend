// components/auth/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Iniciar Sesión</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" #formDirective="ngForm">
            <mat-form-field appearance="outline">
              <mat-label>Usuario</mat-label>
              <input matInput formControlName="username" [disabled]="loading">
              <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                Usuario es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Contraseña</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" 
                     formControlName="password" [disabled]="loading">
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" 
                      [attr.aria-label]="'Ocultar contraseña'" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Contraseña es requerida
              </mat-error>
            </mat-form-field>

            <div class="actions">
              <button mat-raised-button color="primary" type="submit"
                      [disabled]="loginForm.invalid || loading">
                <mat-icon *ngIf="loading">
                  <mat-spinner diameter="20"></mat-spinner>
                </mat-icon>
                <span>{{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}</span>
              </button>
              <a mat-button routerLink="/register">Crear cuenta</a>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      height: calc(100vh - 64px);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 16px;
    }

    mat-card {
      width: 100%;
      max-width: 400px;
      margin: 2rem;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 1rem;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 1rem;

      button {
        width: 100%;
      }
    }

    .mat-mdc-progress-spinner {
      display: inline-block;
      margin-right: 8px;
    }

    @media (min-width: 600px) {
      .actions {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        
        button {
          width: auto;
        }
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.loading) return;

    this.loading = true;
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.showNotification('Inicio de sesión exitoso', 'success');
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        const message = error.error?.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
        this.showNotification(message, 'error');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000, // 5 segundos
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`${type}-snackbar`],
    }).afterDismissed().subscribe(() => {
      // Manejar el evento después de que se cierra la notificación
      console.log('Notificación cerrada');
    });
  }
}