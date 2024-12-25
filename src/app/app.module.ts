// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './modules/material/material.module';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

// Services
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';

// Components
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { UserListComponent } from './components/admin/user-list/user-list.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

@NgModule({
 declarations: [
   AppComponent,
   LoginComponent,
   RegisterComponent,
   ProfileComponent,
   NavbarComponent,
   FooterComponent,
   UserListComponent,
   NavbarComponent
 ],
 imports: [
   BrowserModule,
   BrowserAnimationsModule,
   AppRoutingModule,
   ReactiveFormsModule,
   HttpClientModule,
   RouterModule,
   ReactiveFormsModule,
   MaterialModule
 ],
 providers: [
   // Services
   AuthService,
   TokenService,
   UserService,
   
   // Guards
   AuthGuard,
   AdminGuard,
   
   // Interceptors
   { 
     provide: HTTP_INTERCEPTORS, 
     useClass: AuthInterceptor, 
     multi: true 
   },
   { 
     provide: HTTP_INTERCEPTORS, 
     useClass: ErrorInterceptor, 
     multi: true 
   }
 ],
 bootstrap: [AppComponent]
})
export class AppModule { }