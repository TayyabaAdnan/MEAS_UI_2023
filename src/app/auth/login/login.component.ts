import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Polygon } from 'angular-svg';

type UserFields = 'email' | 'password';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  errorMessage: any;
  loginForm: FormGroup;


  constructor(public authService: AuthService, private fb: FormBuilder, private router: Router, public loaderService: LoaderService) {
    this.loginForm = fb.group({
      username: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.authService.CheckUserExist();
  }

  login() {
    this.authService.SignIn(this.loginForm.value);
  }

}