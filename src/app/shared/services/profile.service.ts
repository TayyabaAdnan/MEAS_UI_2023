import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  BaseUrl: string = environment.apiUrl + environment.apiVersion;
  constructor(private router: Router, private http: HttpClient, private toastr: ToastrService) { }

  //#region Drop Down Values
  GetAllDropDownData(): any {
    return this.http.get<any>(this.BaseUrl + "Profile/GetAppDropdownData").toPromise();
  }
  GetIndicatorDropDownData(): any {
    return this.http.get<any>(this.BaseUrl + "Profile/GetIndicatorDropdownData").toPromise();
  }
  GetHealthFacilities(){
    return this.http.get<any>(this.BaseUrl + "Profile/GetHealthFacilitiesZone").toPromise();
  }
  GetHealthFacilitiesZoneActive(){
    return this.http.get<any>(this.BaseUrl + "Profile/GetHealthFacilitiesZoneActive").toPromise();
  }
  GetApplicationTypes(){
    return this.http.get<any>(this.BaseUrl + "Profile/GetApplicationTypesForZone").toPromise();
  }
  GetRoles(){
    return this.http.get<any>(this.BaseUrl + "Profile/GetRoles").toPromise();
  }
  GetRegions(){
    return this.http.get<any>(this.BaseUrl + "Profile/GetRegions").toPromise();
  }
  GetUserTypes(){
    return this.http.get<any>(this.BaseUrl + "Profile/GetUserType").toPromise();
  }
  GetZoneUser(ZoneId){
    return this.http.get<any>(this.BaseUrl + "Profile/GetUsersByZoneId?ZoneId="+ ZoneId).toPromise();
  }
  //#endregion
}
