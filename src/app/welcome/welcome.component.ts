import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from '../auth/signup/signup.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(public authService: AuthService, public router: Router, public modalOpen: MatDialog) { }

  ngOnInit(): void {
  }

  getStarted() {
    this.authService.userName ? this.router.navigate(['/list']) : this.modalOpen.open(SignupComponent);
  }

}
