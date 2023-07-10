import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndicatordetailService {
  BaseUrl: string = environment.apiUrl + environment.apiVersion;
  constructor(private http: HttpClient) { }

  GetSearchedValue(searhDto: any): any {
    return this.http.post<any>(this.BaseUrl + "IndicatorDetail/getMonitoringModuleEvaluationsExport", searhDto).toPromise();
  }
  GetUtilitiesData(searhDto: any): any {
    return this.http.post<any>(this.BaseUrl + "IndicatorDetail/GetUtilitesData", searhDto).toPromise();
  }
  GetSuppliesData(searhDto: any): any {
    return this.http.post<any>(this.BaseUrl + "IndicatorDetail/GetSuppliesData", searhDto).toPromise();
  }
  GetMedicinesData(searhDto: any): any {
    return this.http.post<any>(this.BaseUrl + "IndicatorDetail/GetMedicinesData", searhDto).toPromise();
  }
  GetEquipmentData(searhDto: any): any {
    return this.http.post<any>(this.BaseUrl + "IndicatorDetail/GetEquipmentData", searhDto).toPromise();
  }
  GetMOPresenceData(searhDto: any): any {
    return this.http.post<any>(this.BaseUrl + "IndicatorDetail/GetMOPresence", searhDto).toPromise();
  }
  GEtOtherStaffPostedData(searhDto: any): any {
    return this.http.post<any>(this.BaseUrl + "IndicatorDetail/GetOtherStaffPostedGraph", searhDto).toPromise();
  }
  GetOtherStaffPresenceData(searhDto: any): any {
    return this.http.post<any>(this.BaseUrl + "IndicatorDetail/GetOtherStaffPresence", searhDto).toPromise();
  }
  GetStockOutMedicnes(searhDto: any): any {
    return this.http.post<any>(this.BaseUrl + "IndicatorDetail/GetStockoutMedicines", searhDto).toPromise();
  }
}
