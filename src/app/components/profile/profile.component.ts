// components/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Mi perfil</mat-card-title>
          <mat-card-subtitle>Gestiona tu información personal</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Usuario</mat-label>
              <input matInput formControlName="username" readonly>
              <mat-icon matSuffix>person</mat-icon>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="firstName" required>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Apellido</mat-label>
                <input matInput formControlName="lastName" required>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline">
              <mat-label>Correo electrónico</mat-label>
              <input matInput formControlName="email" type="email" required>
              <mat-icon matSuffix>email</mat-icon>
            </mat-form-field>

            <div class="button-container">
              <button mat-raised-button color="primary" type="submit">
                Guardar cambios
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 20px;
    }

    .button-container {
      display: flex;
      justify-content: flex-end;
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: any;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: [{value: '', disabled: true}]
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const user = this.tokenService.getUser();
    if (user?.id) {
      this.loading = true;
      this.userService.getProfile(user.id).subscribe({
        next: (profile) => {
          this.user = profile;
          this.profileForm.patchValue({
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            username: profile.username
          });
          this.loading = false;
        },
        error: () => {
          this.snackBar.open('Error loading profile', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    const user = this.tokenService.getUser();
    if (user?.id) {
      this.loading = true;
      this.userService.updateProfile(user.id, this.profileForm.getRawValue()).subscribe({
        next: () => {
          this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
          this.loading = false;
        },
        error: () => {
          this.snackBar.open('Error updating profile', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}