import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UmsService {
  BaseUrl: string = environment.apiUrl + environment.apiVersion;

  constructor(private router: Router, private http: HttpClient) { }

  //#region User Zone Id Change
  UpdateeUserZoneId(users: any): any {
    return this.http.post<any>(this.BaseUrl + "UMS/UpdateUsersZoneId", users).toPromise();
  }
  //#endregion
}
