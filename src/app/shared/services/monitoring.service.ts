import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  BaseUrl: string = environment.apiUrl + environment.apiVersion;
 APIUrl: string = environment.apiUrl;
  constructor(private router: Router, private http: HttpClient) { }

  GetAllEvaluations(paginationDto: any): any {
    return this.http.post<any>(this.BaseUrl + "Evaluation/getallEvaluations", paginationDto).toPromise();
  }

  GetAllEvaluationsNew(paginationDto: any): any {
    return this.http.post<any>(this.BaseUrl + "Evaluation/getallEvaluationsNew", paginationDto).toPromise();
  }

  GetAllCloseEvaluationsNew(paginationDto: any): any {
    return this.http.post<any>(this.BaseUrl + "Evaluation/getallCloseEvaluationsNew", paginationDto).toPromise();
  }

  GetAllEvaluationsWithoutPagination(paginationDto: any): any {
    return this.http.post<any>(this.BaseUrl + "Evaluation/getallEvaluationsWithoutPagination", paginationDto).toPromise();
  }

  GetAllEvaluationsWithoutPaginationDataTable(paginationDto: any): any {
    return this.http.post<any>(this.BaseUrl + "Evaluation/getallEvaluationsWithoutPaginationData", paginationDto).toPromise();
  }

  GetCloseAllEvaluationsWithoutPaginationDataTable(paginationDto: any): any {
    return this.http.post<any>(this.BaseUrl + "Evaluation/getcloseallEvaluationsWithoutPaginationData", paginationDto).toPromise();
  }

  GetAllEvaluationsWithoutPaginationNew(paginationDto: any): any {
    debugger;
    return this.http.post<any>(this.BaseUrl + "Evaluation/getAllDataExport", paginationDto).toPromise();
  }
  GetAllEvaluationsDetailWithoutPagination(paginationDto: any): any {
    return this.http.post<any>(this.BaseUrl + "Evaluation/getModuleEvaluationsExport", paginationDto).toPromise();
  }
  GetMonitoringEvaluationsDetailWithoutPagination(paginationDto: any): any {
    return this.http.post<any>(this.BaseUrl + "Evaluation/getMonitoringModuleEvaluationsExport", paginationDto).toPromise();
  }
  GetMonitoringEvaluationAttendanceExport(paginationDto: any): any {
    return this.http.post<any>(this.BaseUrl + "Evaluation/GetMonitoringAttendanceExport", paginationDto).toPromise();
  }

  GetMonitoringEvaluationAttendanceExportNew(paginationDto: any): any {
    return this.http.post<any>(this.BaseUrl + "Evaluation/GetMonitoringAttendanceExportNew", paginationDto).toPromise();
  }
  GetMonitoringDetail(masterId: any): any {
    return this.http.get<any>(this.BaseUrl + "Evaluation/GetEvaluationDetailById?evaluationMasterId=" + masterId).toPromise();
  }

  GetMonitoringDetailNew(masterId: any): any {
    return this.http.get<any>(this.BaseUrl + "Evaluation/GetEvaluationDetailById1?evaluationMasterId=" + masterId).toPromise();
  }
  CheckRepeatPercentCreated(): any {
    return this.http.get<any>(this.BaseUrl + "Evaluation/CheckIfRepeatPecentageDefined").toPromise();
  }
  GenerateVisits(): any {
    return this.http.get<any>(this.BaseUrl + "Evaluation/GenerateVisits").toPromise();
  }
  GetUsersVists(): any {
    return this.http.get<any>(this.BaseUrl + "Dashboard/GetAllVisits").toPromise();
  }
  GetUsersVistsAll(searchDTO:any): any {
    return this.http.post<any>(this.BaseUrl + "Role/GetMEAsUserVisitAll",searchDTO).toPromise();
  }
  GetRepeatVisitPercet(repeatVisitId:any): any {
    return this.http.get<any>(this.BaseUrl + "Evaluation/GetRepeatVisitById?RepeatVisitId=" + repeatVisitId).toPromise();
  }
  AddUpdateRepatVisit(repeatVisit:any): any {
    return this.http.post<any>(this.BaseUrl + "Evaluation/AddUpdateRepeatVisitsPercentage" , repeatVisit).toPromise();
  }
  GetAllRepeatVisitPercentages(searchDTO:any): any {
    return this.http.post<any>(this.BaseUrl + "Evaluation/GetRepeatVisitList" , searchDTO).toPromise();
  }
  ToggleActiviationOfRepatVisitPercentage(repeatVisitId:any): any {
    return this.http.get<any>(this.BaseUrl + "Evaluation/ActivationRepeatPercentage?repeatVisitId="+ repeatVisitId).toPromise();
  }
  GenerateSpecialVisit(specialVisit: any): any {
    return this.http.post<any>(this.BaseUrl + "Evaluation/SaveSpecialVisits", specialVisit).toPromise();
  }
  ChangeAnswer(changeObject: any): any {
    debugger;
    return this.http.post<any>(this.BaseUrl + "Evaluation/UpdateAnswer", changeObject).toPromise();
  }
}
