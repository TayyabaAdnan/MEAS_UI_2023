import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  BaseUrl: string = environment.apiUrl + environment.apiVersion;
  constructor(private router: Router, private http: HttpClient, private toastr: ToastrService) { }

  //#region Category
  AddUpdateCategory(category: any): any {
    return this.http.post<any>(this.BaseUrl + "Setting/AddUpdateCategory", category).toPromise();
  }
  GetCategoryById(categoryId: any): any {
    return this.http.get<any>(this.BaseUrl + "Setting/GetCategorybyId?categoryId=" + categoryId).toPromise();
  }
  GetCategoriesPaginated(paginationDto: any): any {
    return this.http.post<any>(this.BaseUrl + "Setting/GetCategoriesList", paginationDto).toPromise();
  }
  ActivationCategory(categoryId: any): any {
    return this.http.get<any>(this.BaseUrl + "Setting/ActivationCategory?categoryId=" + categoryId).toPromise();
  }
  //#endregion

  //#region Sub Category
  AddUpdateSubCategory(category: any): any {
    return this.http.post<any>(this.BaseUrl + "Setting/AddUpdateSubCategory", category).toPromise();
  }
  GetSubCategoriesPaginated(paginationDto: any): any {
    return this.http.post<any>(this.BaseUrl + "Setting/GetSubCategoriesList", paginationDto).toPromise();
  }
  ActivationSubCategory(subcategoryId: any): any {
    return this.http.get<any>(this.BaseUrl + "Setting/ToggleActivationSubCategory?subCategoryId=" + subcategoryId).toPromise();
  }
  GetCategories(): any {
    return this.http.get<any>(this.BaseUrl + "Profile/GetCategories").toPromise();
  }
  //#endregion

  //#region Zone
  AddUpdateZone(zone: any): any {
    return this.http.post<any>(this.BaseUrl + "Setting/AddUpdateZone", zone).toPromise();
  }
  GetZonePaginated(paginationDto: any): any {
    return this.http.post<any>(this.BaseUrl + "Setting/GetZoneList", paginationDto).toPromise();
  }
  ActivationZone(zoneId: any): any {
    return this.http.get<any>(this.BaseUrl + "Setting/ActivationZone?zoneId=" + zoneId).toPromise();
  }
  GetZoneById(zoneId: any): any {
    return this.http.get<any>(this.BaseUrl + "Setting/GetZoneById?zoneId=" + zoneId).toPromise();
  }
  //#endregion

  //#region Zone HF
  AddZoneHf(zonehf: any): any {
    return this.http.post<any>(this.BaseUrl + "Setting/AddUpdateZoneHF", zonehf).toPromise();
  }
  //#endregion

  //#region HF ActivationCategory
  ToggleActivationHF(hfId: any): any {
    return this.http.get<any>(this.BaseUrl + "Setting/ToggleActivationHF?hfId="+hfId).toPromise();
  }
  ToggleActivationHFRemarks(HfInactive: any): any {
    return this.http.post<any>(this.BaseUrl + "Setting/InActiveHF",HfInactive).toPromise();
  }
  //#endregion
}
