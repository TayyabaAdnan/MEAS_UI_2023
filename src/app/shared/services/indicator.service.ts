import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {
  BaseUrl: string = environment.apiUrl + environment.apiVersion;
  constructor(private router: Router, private http: HttpClient, private toastr: ToastrService) { }

  //#region Indicator
  AddUpdateIndicator(indicator: any): any {
    return this.http.post<any>(this.BaseUrl + "Indicator/AddUpdateIndicator", indicator).toPromise();
  }
  AddAllIndicator(indicator: any): any {
    return this.http.post<any>(this.BaseUrl + "Indicator/AddUpdateIndicatorNew", indicator).toPromise();
  }
  GetIndicatorList(paginationDTO: any): any {
    return this.http.post<any>(this.BaseUrl + "Indicator/getIndicatorsNew", paginationDTO).toPromise();
  }
  ToggeleActivationIndicator(indicatorId: number) {
    return this.http.get<any>(this.BaseUrl + "Indicator/ToggleActivationIndicator?indicatorId=" + indicatorId).toPromise();
  }
  GetIndicatorById(indicatorId: number) {
    return this.http.get<any>(this.BaseUrl + "Indicator/GetIndicatorById?indicatorId=" + indicatorId).toPromise();
  }
  SearchIndicator(indicator: any): any {
    return this.http.post<any>(this.BaseUrl + "Indicator/GetIndicators", indicator).toPromise();
  }
  SavePhysicalViewIndicator(indicator: any): any {
    return this.http.post<any>(this.BaseUrl + "Indicator/SavePhysicalViewOfIndicator", indicator).toPromise();
  }
  //#endregion

  //#region View Indicator
  GetIndicators(filterDTO: any): any {
    return this.http.post<any>(this.BaseUrl + "Indicator/ViewIndicators", filterDTO).toPromise();
  }
  //#endregion
}
