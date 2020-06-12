import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    public modalClose: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public route: Router,
    public authService: AuthService,
    public modalOpen: MatDialog) { }



  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(15)])
    })
  }

  onLogin(form) {
    this.authService.login(form);
    this.modalClose.close();
    this.route.navigate(["/list"]);
  }

  goToSignup(){
    this.modalClose.close();
    this.modalOpen.open(SignupComponent)
  }

}