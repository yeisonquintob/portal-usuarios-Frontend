// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  imagePreview: string | null = null;
  originalUser: any = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.profileForm = this.fb.group({
      username: [{value: '', disabled: true}],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      currentPassword: [''],
      newPassword: [''],
      confirmNewPassword: ['']
    }, { validator: this.passwordMatchValidator });
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
        error: (error) => {
          this.snackBar.open('Error loading profile', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.resetForm();
    }
  }

  resetForm() {
    if (this.originalUser) {
      this.profileForm.patchValue({
        email: this.originalUser.email,
        firstName: this.originalUser.firstName,
        lastName: this.originalUser.lastName,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Upload image
      const user = this.tokenService.getUser();
      if (user?.id) {
        this.loading = true;
        this.userService.updateProfilePicture(user.id, file).subscribe({
          next: (response) => {
            this.snackBar.open('Profile picture updated successfully', 'Close', { duration: 3000 });
            this.loading = false;
          },
          error: (error) => {
            this.snackBar.open('Error updating profile picture', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmNewPassword')?.value;

    if (newPassword || confirmPassword) {
      return newPassword === confirmPassword ? null : { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.profileForm.invalid || !this.isEditMode) return;

    const user = this.tokenService.getUser();
    if (user?.id) {
      this.loading = true;
      // Filter out password fields if they're empty
      const formValue = this.profileForm.value;
      const updateData: any = {
        email: formValue.email,
        firstName: formValue.firstName,
        lastName: formValue.lastName
      };

      if (formValue.currentPassword && formValue.newPassword) {
        updateData.currentPassword = formValue.currentPassword;
        updateData.newPassword = formValue.newPassword;
        updateData.confirmNewPassword = formValue.confirmNewPassword;
      }

      this.userService.updateProfile(user.id, updateData).subscribe({
        next: (response) => {
          this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
          this.originalUser = response;
          this.isEditMode = false;
          this.loading = false;
          
          // Update stored user data
          this.tokenService.saveUser({
            ...user,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email
          });
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Error updating profile', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}