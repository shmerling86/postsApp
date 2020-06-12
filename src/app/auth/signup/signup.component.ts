import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { mimeType } from "../../mime-type.validator";
import { LoginComponent } from '../login/login.component';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  imagePreview: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    public modalClose: MatDialogRef<SignupComponent>, 
    public modalOpen: MatDialog) { }

  ngOnInit(): void {

    this.signupForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(10)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType]})
    })
  }

  onSignup(form) {
    if (this.signupForm.invalid) {
      return;
    }
    this.authService.signup(form);
    this.modalClose.close();
  }

  goToLogin(){
    this.modalClose.close();
    this.modalOpen.open(LoginComponent)
  }

  onProfileImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.signupForm.patchValue({ image: file });
    this.signupForm.get("image").updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
