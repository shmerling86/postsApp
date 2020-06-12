import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { LoginComponent } from '../auth/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from '../auth/signup/signup.component';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { mimeType } from '../mime-type.validator';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PostsService } from '../posts/posts.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(
    private http: HttpClient,
    public router: Router,
    public authService: AuthService,
    public modalOpen: MatDialog
  ) { }

  changeImageForm: FormGroup;
  isLoginSub: Subscription;
  isLogin: boolean;
  imagePreview: string;

  ngOnInit(): void {
    this.isLoginSub = this.authService.isLogin.subscribe(e => {
      this.isLogin = e;
    })
    this.getUserName();

    this.changeImageForm = new FormGroup({
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    })
  }

  onLogin() {
    this.modalOpen.open(LoginComponent);
  }

  onSignup() {
    this.modalOpen.open(SignupComponent);
  }

  getUserName() {
    this.authService.loggedUser.subscribe((userName) => { this.authService.userName = userName });
  }

  // onPickedImage(event: Event) {
  //   const file = (event.target as HTMLInputElement).files[0];
  //   this.changeImageForm.patchValue({ image: file });
  //   this.changeImageForm.get("image").updateValueAndValidity();

  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imagePreview = reader.result as string;
  //   };
  //   reader.readAsDataURL(file);

  // }

  // onChangeProfileImage() {
  //   const changeImageFormData = new FormData();
  //   changeImageFormData.append("image", this.changeImageForm.value.image, "New image");

  //   this.http.put(`${environment.apiUrl}/user/${this.authService.userId}`, changeImageFormData)
  //     .subscribe((res) => { console.log(res) },
  //       (error) => {
  //         console.log("onChangeProfileImage", error.error);
  //       });
  // }

  ngOnDestroy(): void {
    this.isLoginSub.unsubscribe();
  }

}
