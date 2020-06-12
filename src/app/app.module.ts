import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorComponent } from './error/error.component'
import { ListComponent } from './posts/list/list.component';
import { CreateComponent } from './posts/create/create.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth.iterceptor';
import { AuthService } from './auth/auth.service';
import { WelcomeComponent } from './welcome/welcome.component';
import { TopRatedComponent } from './top-rated/top-rated.component';
import { KeepsComponent } from './keeps/keeps.component'


@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    ListComponent,
    CreateComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    WelcomeComponent,
    TopRatedComponent,
    KeepsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    HttpClientModule,
    MatExpansionModule,
    MatDialogModule,
    MatMenuModule,
    MatTabsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: MAT_DIALOG_DATA, useValue: {}
    },
    {
      provide: MatDialogRef, useValue: {
        close: () => { }
      }
    },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
