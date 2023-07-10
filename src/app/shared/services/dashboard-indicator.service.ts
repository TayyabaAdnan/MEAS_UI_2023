import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardIndicatorService {
  BaseUrl: string = environment.apiUrl + environment.apiVersion;
  constructor(private http: HttpClient) { }

  GetDashboardDropdownData(): any {
    return this.http.get<any>(this.BaseUrl + "Profile/IndicatorDetailData").toPromise();
  }
  GetUserVisitDetail(userId): any {
    return this.http.get<any>(this.BaseUrl + "Profile/GetUserVisitsDetail?userId=" + userId).toPromise();
  }
  GetMeasComplianceCoverage(searchForm): any {
    return this.http.post<any>(this.BaseUrl + "Dashboard/GetMEAsCoverageAndCompliance",searchForm).toPromise();
  }

  GetTodaysVisitDetails(hft): any {
    debugger;
    return this.http.post<any>(this.BaseUrl + "Dashboard/GetTodaysVisitDetails", hft).toPromise();
  }

  GetDashboardCount(): any {
    return this.http.post<any>(this.BaseUrl + "Dashboard/GetDashboardCounts",0).toPromise();
  }


  //public GetDashboardCount() {
    //  debugger;
  //     return this.http.get(`${Config.getControllerUrl("Attandance", "GetDashboardCount")}`);
    // }
}
