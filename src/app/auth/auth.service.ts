import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './login/user.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorComponent } from '../error/error.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    public route: Router,
    private http: HttpClient,
    public dialog: MatDialog,
  ) { }

  isLogin = new BehaviorSubject<boolean>(false);
  token: string = localStorage.getItem("token") || null;
  userId: string = localStorage.getItem("userID") || null;
  userName: string = localStorage.getItem("name") || null;
  userProfileImage: string = localStorage.getItem("profileImage") || null;
  loggedUser = new Subject<string>();
  keeps: string[] = [];

  login(form) {
    if (form.invalid) return
    const user: User = {
      email: form.value.email,
      password: form.value.password
    };
    this.http.post(`${environment.apiUrl}/user/login`, user)
      .subscribe((res: { token: string, id: string, name: string, profileImage: string, keeps: string[] }) => {
        this.saveAuthData(res.token, res.id, res.name, res.profileImage);
        this.SaveResponseFromUserLogin(res.token, res.id, res.name, res.profileImage, res.keeps);
        this.isLogin.next(true);
      },
        (error) => {
          console.log("onLogin", error.error);
          const dialogRef = this.dialog.open(ErrorComponent, {
            data: { message: error.error.message },
          });
        });
  }

  signup(form) {
    const signData = new FormData();
    signData.append("name", form.value.name);
    signData.append("email", form.value.email);
    signData.append("password", form.value.password);
    signData.append("image", form.value.image, form.value.name);

    this.http.post(`${environment.apiUrl}/user/signup/`, signData)
      .subscribe((res: { token: string, id: string, name: string, profileImage: string }) => {
        this.saveAuthData(res.token, res.id, res.name, res.profileImage);
        this.SaveResponseFromUserLogin(res.token, res.id, res.name, res.profileImage);

        this.isLogin.next(true);
      },
        (error) => {
          console.log("onSignup", error.error);
          const dialogRef = this.dialog.open(ErrorComponent, {
            data: { message: error.error.message },
          });
        });
  }

  logout() {
    this.loggedUser.next(null);
    this.clearAuthData();
    this.isLogin.next(false);
    this.token = null;
    this.userProfileImage = null;
    this.route.navigate(["/"]);
  }

  SaveResponseFromUserLogin(token, id, name, profileImage, keeps?) {
    this.token = token;
    this.userId = id;
    this.loggedUser.next(name);
    this.userProfileImage = profileImage;
    this.keeps = keeps
  }

  saveAuthData(token, userId, name, profileImage) {
    localStorage.setItem('token', token);
    localStorage.setItem('userID', userId);
    localStorage.setItem('name', name);
    localStorage.setItem('profileImage', profileImage);

  }

  clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    localStorage.removeItem("name");
    localStorage.removeItem('profileImage');

  }

  getUserId() {
    return this.userId;
  }

  getToken() {
    return this.token;
  }



}
