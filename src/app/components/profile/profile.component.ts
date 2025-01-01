// src/app/components/profile/profile.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { NotificationService } from '../../services/notification.service';
import { User } from '../../interfaces/user.interface';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  loading = false;
  imagePreview: string | null = null;
  originalUser: User | null = null;
  isEditMode = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private tokenService: TokenService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      username: [{value: '', disabled: true}],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      currentPassword: [''],
      newPassword: ['', [
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')
      ]],
      confirmNewPassword: ['']  // Cambiado para coincidir con el DTO del backend
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    const user = this.tokenService.getUser();
    if (!user?.userId) {
      this.notificationService.error('No se pudo cargar la información del usuario');
      return;
    }

    this.loading = true;
    this.userService.getProfile(user.userId).subscribe({
      next: (profile: User) => {
        this.originalUser = profile;
        this.profileForm.patchValue({
          username: profile.username,
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName
        });
        this.imagePreview = profile.profilePicture || null;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading profile:', error);
        this.notificationService.error(error?.error?.message || 'Error al cargar el perfil');
        this.loading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const file = element.files?.[0];
    
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      this.notificationService.error('Solo se permiten imágenes JPG, PNG o GIF');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.notificationService.error('La imagen no debe superar los 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);

    const user = this.tokenService.getUser();
    if (!user?.userId) return;

    this.loading = true;
    this.userService.updateProfilePicture(user.userId, file).subscribe({
      next: (response: {profilePicture: string}) => {
        this.notificationService.success('Foto de perfil actualizada');
        if (this.originalUser) {
          this.originalUser.profilePicture = response.profilePicture;
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error updating profile picture:', error);
        this.notificationService.error('Error al actualizar la foto de perfil');
        this.loading = false;
      }
    });
  }

  private passwordMatchValidator(formGroup: FormGroup): {[key: string]: boolean} | null {
    const newPassword = formGroup.get('newPassword');
    const confirmNewPassword = formGroup.get('confirmNewPassword');
    const currentPassword = formGroup.get('currentPassword');

    if (newPassword?.value || confirmNewPassword?.value) {
      if (!currentPassword?.value) {
        return { currentPasswordRequired: true };
      }
      if (newPassword?.value !== confirmNewPassword?.value) {
        return { passwordMismatch: true };
      }
    }

    return null;
  }

  onSubmit(): void {
    if (this.profileForm.invalid || !this.isEditMode) return;

    const user = this.tokenService.getUser();
    if (!user?.userId) return;

    const formData = this.profileForm.value;
    const updateData: any = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName
    };

    // Solo incluir datos de contraseña si se está intentando cambiar
    if (formData.currentPassword && formData.newPassword) {
      updateData.currentPassword = formData.currentPassword;
      updateData.newPassword = formData.newPassword;
      updateData.confirmNewPassword = formData.confirmNewPassword;  // Cambiado para coincidir con el DTO
    }

    this.loading = true;
    this.userService.updateProfile(user.userId, updateData).subscribe({
      next: (updatedUser: User) => {
        this.originalUser = updatedUser;
        this.isEditMode = false;
        this.notificationService.success('Perfil actualizado correctamente');
        
        this.tokenService.saveUser({
          ...user,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email
        });

        // Limpiar campos de contraseña
        this.profileForm.patchValue({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.notificationService.error(error?.error?.message || 'Error al actualizar el perfil');
        this.loading = false;
      }
    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.resetForm();
    }
  }

  private resetForm(): void {
    if (this.originalUser) {
      this.profileForm.patchValue({
        email: this.originalUser.email,
        firstName: this.originalUser.firstName,
        lastName: this.originalUser.lastName,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''  // Cambiado para coincidir con el DTO
      });
    }
  }

  get emailControl() { return this.profileForm.get('email'); }
  get firstNameControl() { return this.profileForm.get('firstName'); }
  get lastNameControl() { return this.profileForm.get('lastName'); }
}