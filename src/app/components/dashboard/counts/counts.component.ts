import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DashboardIndicatorService } from 'src/app/shared/services/dashboard-indicator.service';
import { DatePipe } from '@angular/common';
import {dashboardCounts} from './dashboardCounts.class';
import { LoaderService } from 'src/app/shared/services/loader.service';
import * as Highcharts from 'highcharts';
import { IndicatordetailService } from 'src/app/shared/services/indicatordetail.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-counts',
  templateUrl: './counts.component.html',
  styleUrls: ['./counts.component.scss']
})
export class CountsComponent implements OnInit {

  public mainCount : dashboardCounts;
  public selectedAt: any = {};
  public hft: number;
  public vList: any[] = [];
  public noData : string;
  public print : boolean = false;
  public loading = true;


  searchForm: FormGroup;
  Fromdate: string;
  Todate: string;
  DistrictList: any;
  HfTypeList: any[];
  ShiftList: any[];
  selectedHfShifts: any[];
  indicatorType: any;
  indicatorTypeValue: string;
  districtName: string;


  constructor(private fb: FormBuilder,
    private router: Router, private _toastrService: ToastrService, private _dashboardIndicatorService: DashboardIndicatorService,
    public loaderService: LoaderService, private _indicatordetailService: IndicatordetailService)
     { 
      var date = new Date();
      const datepipe: DatePipe = new DatePipe('en-US')
      //this.Fromdate = datepipe.transform(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy-MM-dd');
    //  this.Todate = datepipe.transform(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'yyyy-MM-dd');
    }

  ngOnInit(): void {

    this.searchForm = this.fb.group({
      DistrictCode: ["0"],
      Designation: ["MEA"],
      HfType: ["1"],
      ShiftId: ["1"],
      IndicatorType: ["MOPosted"],
      fromDate: [this.Fromdate],
      toDate: [this.Todate],
      GraphType: ["All"],
      DistrictName: [""]
    });
    this.Initialization();

    this.mainCount = new dashboardCounts();
    this.presentCount();
  }

  Initialization() {
    this._dashboardIndicatorService.GetDashboardDropdownData().then((res) => {
      if (!res.Error) {
        this.DistrictList = res.List.districts;
        this.HfTypeList = res.List.hfTypes;
        this.ShiftList = res.List.shiftsHfTypes;
        this.selectedHfShifts = this.ShiftList.filter(x => x.HFTypeId == this.searchForm.controls["HfType"].value);
      } else {
        this._toastrService.error(res.Message, "Error");
      }
    }).catch((error) => {
      this._toastrService.error(error.message, "Error");
    });
  }
  GetHfShifts(hfTypeId) {
    this.selectedHfShifts = this.ShiftList.filter(x => x.HFTypeId == hfTypeId && x.ShiftId != 2 && x.ShiftId != 3);
  }

public getTodaysVisitDetails(hft: number)
{     
debugger;
this._dashboardIndicatorService.GetTodaysVisitDetails(hft).then((dsh: any) => {
  debugger;
  console.log(dsh.List);
}
    );    
  };

  private handleError(err:any){
    /* this._notificationService.notify("danger", "Error!");
    this.loading = false;
    if(err.status == 403){
      this._authenticationService.logout();
    } */
  }

  private handleResponse1(response: any)
  {  
    this.vList = [];   
    this.vList = response;
    //this.print = true;
    if(this.vList.length == 0)
    {
    //  this.roster.EmployeeName = this.rosterList.
      this.noData ="No data found!"
      //this.print = false;
    }
    else
    {
      this.noData = "";
    }
    console.log(this.vList);
    
    }

    getMeasEvalutionListByPagination(): void {
      debugger;
     /*  this._monitoringService.GetAllEvaluationsNew(this.filterObj).then((res) => {
        if (!res.Error) {
          this.measEvalution = res.Data;
          this.filterObj.pageCount = res.PageCount;
          this.filterObj.pageNumber = res.PageNumber;
          this.filterObj.size = res.Size;
          this.filterObj.totalRecords = res.TotalRecords;
        } else {
          this._toastrService.error(res.Message, "Error");
        }
      }); */
    }
    
  public presentCount(){
    this._dashboardIndicatorService.GetDashboardCount().then((dsh: any) => {
if (dsh)
      {    
        this.mainCount.TodayVisits = dsh.List[0].TodayVisits;
        this.mainCount.TodayOpenVisits = dsh.List[0].TodayOpenVisits;
        this.mainCount.TodayCloseVisits = dsh.List[0].TodayCloseVisits;
        this.mainCount.TodayBHUVisits = dsh.List[0].TodayBHUVisits;
        this.mainCount.TodayBHU247Visits = dsh.List[0].TodayBHU247Visits;
        this.mainCount.TodayRHCVisits = dsh.List[0].TodayRHCVisits;
       /*  this.mainCount.TodayTHQVisits = dsh.List[0].TodayTHQVisits;
        this.mainCount.TodayDHQVisits = dsh.List[0].TodayDHQVisits; */


        this.mainCount.TodayOpenBHUVisits = dsh.List[0].TodayOpenBHUVisits;
        this.mainCount.TodayCloseBHUVisits = dsh.List[0].TodayCloseBHUVisits;
        this.mainCount.TodayCloseBHU247Visits = dsh.List[0].TodayCloseBHU247Visits;
        this.mainCount.TodayopenBHU247Visits = dsh.List[0].TodayopenBHU247Visits;
        this.mainCount.TodayopenRHCVisits = dsh.List[0].TodayopenRHCVisits;
        this.mainCount.TodayCloseRHCVisits = dsh.List[0].TodayCloseRHCVisits;
       /*  this.mainCount.TodayOpenTHQVisits = dsh.List[0].TodayOpenTHQVisits;
        this.mainCount.TodayCloseTHQVisits = dsh.List[0].TodayCloseRHCVisits;
        this.mainCount.TodayOpenDHQVisits = dsh.List[0].TodayOpenDHQVisits;
        this.mainCount.TodayCloseDHQVisits = dsh.List[0].TodayCloseRHCVisits; */

        this.mainCount.weekTotal = dsh.List[0].weekTotal;
        this.mainCount.weekBHUVisits = dsh.List[0].weekBHUVisits;
        this.mainCount.weekBHU247Visits = dsh.List[0].weekBHU247Visits;
        this.mainCount.weekRHCVisits = dsh.List[0].weekRHCVisits;

        this.mainCount.weekOpenTotal = dsh.List[0].weekOpenTotal;
        this.mainCount.weekCloseTotal = dsh.List[0].weekCloseTotal;
        this.mainCount.weekOpenBHUVisits = dsh.List[0].weekOpenBHUVisits;
        this.mainCount.weekCloseBHUVisits = dsh.List[0].weekCloseBHUVisits;
        this.mainCount.weekOpenBHU247Visits = dsh.List[0].weekOpenBHU247Visits;
        this.mainCount.weekcloseBHU247Visits = dsh.List[0].weekcloseBHU247Visits;
        this.mainCount.weekOpenRHCVisits = dsh.List[0].weekOpenRHCVisits;
        this.mainCount.weekCloseRHCVisits = dsh.List[0].weekCloseRHCVisits;

    
        this.mainCount.monthVisits = dsh.List[0].monthVisits;
        this.mainCount.monthBHUVisits = dsh.List[0].monthBHUVisits;
        this.mainCount.monthBHU247Visits = dsh.List[0].monthBHU247Visits;
        this.mainCount.monthRHCVisits = dsh.List[0].monthRHCVisits;

        this.mainCount.monthOpenVisits = dsh.List[0].monthOpenVisits;
        this.mainCount.monthCloseVisits = dsh.List[0].monthCloseVisits;
        this.mainCount.monthOpenBHUVisits = dsh.List[0].monthOpenBHUVisits;
        this.mainCount.monthCloseBHUVisits = dsh.List[0].monthCloseBHUVisits;
        this.mainCount.monthOpenBHU247Visits = dsh.List[0].monthOpenBHU247Visits;
        this.mainCount.monthCloseBHU247Visits = dsh.List[0].monthCloseBHU247Visits;
        this.mainCount.monthOpenRHCVisits = dsh.List[0].monthOpenRHCVisits;
        this.mainCount.monthCloseRHCVisits = dsh.List[0].monthCloseRHCVisits;
    
        this.mainCount.TotalVisits = dsh.List[0].TotalVisits;
        this.mainCount.TotalBHUVisits = dsh.List[0].TotalBHUVisits;
        this.mainCount.TotalBHU247Visits = dsh.List[0].TotalBHU247Visits;
        this.mainCount.TotalRHCVisits = dsh.List[0].TotalRHCVisits;

        this.mainCount.TotalOpenVisits = dsh.List[0].TotalOpenVisits;
        this.mainCount.TotalCloseVisits = dsh.List[0].TotalCloseVisits;
        this.mainCount.TotalOpenBHUVisits = dsh.List[0].TotalOpenBHUVisits;
        this.mainCount.TotalCloseBHUVisits = dsh.List[0].TotalCloseBHUVisits;
        this.mainCount.TotalOpenBHU247Visits = dsh.List[0].TotalOpenBHU247Visits;
        this.mainCount.TotalCloseBHU247Visits = dsh.List[0].TotalCloseBHU247Visits;
        this.mainCount.TotalOpenRHCVisits = dsh.List[0].TotalOpenRHCVisits;
        this.mainCount.TotalCloseRHCVisits = dsh.List[0].TotalCloseRHCVisits;
      }
    }
    )
  }
}
