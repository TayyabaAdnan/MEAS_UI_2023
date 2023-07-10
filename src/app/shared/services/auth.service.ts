import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from '../Models/User';
import { ToastrService } from 'ngx-toastr';
import { cookieService } from 'src/app/shared/services/cookie.service';
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  BaseUrl: string = environment.apiUrl + environment.apiVersion;
  public showLoader: boolean = false;
  public userData: any;
  public user: User;
  constructor(private router: Router, private http: HttpClient, private _cookieService: cookieService, private toastr: ToastrService) {
  }
  CheckUserExist() {
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user == null) {
      this.router.navigate(['/auth/login']);
    } else if (this.user.Token == null) {
      this.router.navigate(['/auth/login']);
    }
    else {
      this.router.navigate(['/dashboard']);
    }
  }
  getProductsSmall() {
    return this.http.get<any>('assets/products-small.json')
    .toPromise()
    .then(res => <any[]>res.data)
    .then(data => { return data; });
  }
  //Authentication for Login
  SignIn(login: any) {
    this.showLoader = true;
    return this.http.post<any>(this.BaseUrl + "UserAuthentication/UserLoginWeb", login).toPromise()
      .then((res) => {
        this.showLoader = false;
        if (!res.Error) {
          this.user = res.Data;
          //this._cookieService.setCookie('user', JSON.stringify(res.Data),1);
          localStorage.setItem('user', JSON.stringify(res.Data));
          
          if ( this.user.UserId == 1  ||  this.user.UserId == 6){
            this.router.navigate(['/evaluation/list']);
          }
          else{
            this.router.navigate(['/dashboard/counts']);
          }
        
        } else {
          localStorage.setItem('user', null);
          //this._cookieService.setCookie('user', null,0);
          this.toastr.error(res.Message, "Error");
        }
      }).catch((error) => {
        this.showLoader = false;
        this.toastr.error(error.message, "Error");
      });
  }

  public currentUser(): User {
    if (!this.user)
      //this.user= JSON.parse(this._cookieService.getCookie('user'));
      this.user = JSON.parse(localStorage.getItem('user'));
    return this.user;
  }
  public getToken(): string {
    var token = "";
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user != null) {
      token = this.user.Token;
    }
    return token;
  }

  // Sign out
  SignOut() {
    this.showLoader = false;
    //  this._cookieService.deleteCookie('user');
    localStorage.removeItem("user");
    this.router.navigate(['/auth/login']);
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user != null && user.emailVerified != false) ? true : false;
  }
}
