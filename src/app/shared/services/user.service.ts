import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { User } from '../Models/User';
import { ToastrService } from 'ngx-toastr';
import { Paginatedfilterdto } from 'src/app/shared/Models/Paginationfilterdto'
import { SearchListDTO } from '../Models/DTO/SearchListDTO';
@Injectable({
  providedIn: 'root'
})

export class UserService {

  BaseUrl: string = environment.apiUrl + environment.apiVersion;
  public showLoader: boolean = false;
  public userData: any;
  public userlist: any[];
  public user: User;
  filterObj: SearchListDTO = new SearchListDTO();
  constructor(private router: Router, private http: HttpClient, private toastr: ToastrService) {

  }
  getDivsion(provinceId: string): any {
    return this.http.get<any>(this.BaseUrl + "Profile/GetDivisionByProvinceId?provinceId=" + provinceId).toPromise();
  }
  getDDTU(provinceId: string, type: string, siaUC: boolean = false): any {
    return this.http.get<any>(this.BaseUrl + "Profile/GetDDTU?PKCode=" + provinceId + "&type=" + type + "&isSIAUC = " + siaUC).toPromise();
    // .then((res) => {
    //     if(!res.Error)
    //     {
    //       this.locations = res.Data;
    //     }
    //         }).catch((error) => {
    //             console.log("Error",error);
    //         });

  }
  getSIAUc(provinceId: string, type: string): any {
    return this.http.get<any>(this.BaseUrl + "Profile/GetSiaUC?PKCode=" + provinceId + "&type=" + type).toPromise();
  }
  getByFilter(): any {
    return this.http
      .post<any>(this.BaseUrl + "Role/GetAllUsers", this.filterObj)
      .toPromise();
  }
  GetUserActivities(): any {
    return this.http
      .post<any>(this.BaseUrl + "Role/GetUserActitivities", this.filterObj)
      .toPromise();
  }

  ExportUserActivities(): any {
    return this.http
      .post<any>(this.BaseUrl + "Role/ExportUserActitivities", this.filterObj)
      .toPromise();
  }
  ExportUserList(): any {
    return this.http
      .post<any>(this.BaseUrl + "Role/GetAllUsersExport", this.filterObj)
      .toPromise();
  }
  activeToggleRecord(Guid: string): any {
    return this.http
      .delete<any>(this.BaseUrl + "Role/Delete?id=" + Guid)
      .toPromise();
  }
  RegisterUser(register: any): any {
    this.showLoader = true;
    return this.http.post<any>(this.BaseUrl + "Role/RegisterUser", register).toPromise()
      .then((res) => {
        this.showLoader = false;
        if (res) {
          this.user = res.Data;
          this.toastr.success(res.Message, "Success");
        } else {
          this.toastr.error(res.Message, "Error");
        }
      }).catch((error) => {
        this.showLoader = false;
        this.toastr.error(error.Message, "Error");
      });
  }
  getByIdFromMemory(userId: number) {
    debugger;
    if (this.userlist) return this.userlist.find((x) => x.UserId == userId);
  }
  getByUserId(userId: number): any {
    return this.http
      .get<any>(this.BaseUrl + "Role/GetById?userId=" + userId)
      .toPromise();
  }
  ToggleActivationUser(obj: any): any {
    this.showLoader = true;
    return this.http.put<any>(this.BaseUrl + "Role/ActiveDeactive", obj).toPromise();
  }
  DeleteUser(obj: any): any {
    this.showLoader = true;
    return this.http.put<any>(this.BaseUrl + "Role/DeleteUser", obj).toPromise();
  }
  getMEAsUserVisit(filterObj: any): any {
    return this.http.post<any>(this.BaseUrl + "Role/GetMEAsUserVisit", filterObj).toPromise();
  }
  getMEAsVisitExport(filterObj: any): any {
    return this.http.post<any>(this.BaseUrl + "Role/GetMEAsVisitExport", filterObj).toPromise();
  }
}