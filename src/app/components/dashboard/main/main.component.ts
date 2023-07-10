import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { MonitoringService } from 'src/app/shared/services/monitoring.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import * as XLSX from 'xlsx';
import { SearchListDTO } from 'src/app/shared/Models/DTO/SearchListDTO';
import { DashboardIndicatorService } from 'src/app/shared/services/dashboard-indicator.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  user: any;
  currentDate: Date;
  isVisitGenerateShow: boolean = false;
  usersVisits: any;
  filterObj: SearchListDTO = new SearchListDTO();
  meaComplianceCoverage: any;
  compliancePercent: any;
  reorderable = true;
  measComplianceCoverageFilter: any;
  searchForm: FormGroup;
  Fromdate: string;
  Todate: string;
  DistrictList: any;
  HfTypeList: any[];
  ShiftList: any[];
  selectedHfShifts: any[];
  yearsList: Array<number> = [];
  month: number;
  year: number;
  userVisitDetail:any;

  constructor(public loaderService: LoaderService, public _monitoringService: MonitoringService,
    public _toastrService: ToastrService, public _loginService: AuthService, public _dashboardService: DashboardIndicatorService,
    private fb: FormBuilder) {
    this.user = this._loginService.currentUser();
    this.currentDate = new Date();
    let year = this.currentDate.getFullYear();
    let month = this.currentDate.getMonth();
    let firstDay = new Date(year, month, 1);
    let fifthDay = new Date(year, month, 30);
    if (this.currentDate >= firstDay && this.currentDate <= fifthDay) {
      this.isVisitGenerateShow = true;
    }
    // var date = new Date();
    // const datepipe: DatePipe = new DatePipe('en-US')
    // this.Fromdate = datepipe.transform(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy-MM-dd');
    // this.Todate = datepipe.transform(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'yyyy-MM-dd');
    this.month = new Date().getMonth() + 1;
    this.year = new Date().getFullYear();
    this.GetYearList();
  }
  GetYearList() {
    var currentYear = 2021;
    while (currentYear <= this.year) {
      this.yearsList.push(currentYear);
      currentYear++;
    }
  }
  ngOnInit(): void {
    this.searchForm = this.fb.group({
      DistrictCode: ["0"],
      HfType: ["1"],
      ShiftId: ["1"],
      // fromDate: [this.Fromdate],
      // toDate: [this.Todate],
      month:[this.month],
      year:[this.year]
    });
    this.Initialization();
    this.getMeasComplanceCoverageListByPagination();
  }
  GenerateVisits() {
    this._monitoringService.CheckRepeatPercentCreated().then((res) => {
      if (!res.Error) {
        this._monitoringService.GenerateVisits().then((res) => {
          if (!res.Error) {
            this._toastrService.success(res.Message, "Success");
          } else {
            this._toastrService.error(res.Message, "Error");
          }
        });
      } else {
        if (confirm(res.Message + " Are You Sure You Want To Continue without Repeat Visits??")) {
          this._monitoringService.GenerateVisits().then((res) => {
            if (!res.Error) {
              this._toastrService.success(res.Message, "Success");
            } else {
              this._toastrService.error(res.Message, "Error");
            }
          });
        }
        else {
          this._toastrService.error(res.Message + " Please Create Repeat % First.", "error");
        }
      }
    })

  }
  GetCurrentMonthVisits() {
    this._monitoringService.GetUsersVists().then((res) => {
      if (!res.Error) {
        this.usersVisits = res.List;
        setTimeout(() => {
          this.ExportExcel();
        }, 3000);
      }
    });
  }
  setPage(pageInfo) {
    this.filterObj.pageNumber = parseInt(pageInfo.offset);
    this.getMeasComplanceCoverageListByPagination();
  }
  getMeasComplanceCoverageListByPagination(): void {
  
    this._dashboardService.GetMeasComplianceCoverage(this.searchForm.value).then((res) => {
      if (!res.Error) {
        debugger;
        this.meaComplianceCoverage = res.List.userComplianceCoverageDTOs;
        this.measComplianceCoverageFilter = res.List.userComplianceCoverageDTOs;
        this.compliancePercent = res.List.compliancePercent;
        
       // this.filterObj.pageCount = 20; 
        this.filterObj.pageNumber = 0;//res.PageNumber;
        this.filterObj.pageCount = res.List.meaComplianceCoverage.length; 
        this.filterObj.size = res.List.meaComplianceCoverage.length;//res.Size;
        this.filterObj.totalRecords = res.List.meaComplianceCoverage.length;////res.TotalRecords;
      } else {
        this._toastrService.error(res.Message, "Error");
      }
    });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.filterObj.queryString = val;
    this.filterObj.pageNumber = 0;
    debugger;
    this.measComplianceCoverageFilter = this.meaComplianceCoverage.filter(x => x.FullName.toLowerCase().startsWith(val) || x.DistrictName.toLowerCase().startsWith(val) || x.ZoneName.toLowerCase().startsWith(val))
    //this.getMeasComplanceCoverageListByPagination();
  }
  SearchRecord() {
    this.filterObj.pageNumber = 0;
    this.getMeasComplanceCoverageListByPagination();
  }
  onSort(event) {
    console.log(event);
  }
  Initialization() {
    this._dashboardService.GetDashboardDropdownData().then((res) => {
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
  search() {
    this.getMeasComplanceCoverageListByPagination();
  }
  public ExportExcel(): void {
    let element = document.getElementById("tblUserVisits");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    let fileName = "Users Visits.xlsx"
    if (this.usersVisits.length > 0) {
      fileName = this.usersVisits[0].CurrentMonth + "_" + this.usersVisits[0].CurentYear + "_Users Visits.xlsx";
    }
    XLSX.writeFile(wb, fileName);
  }
  onSelect(event)
  {
    this._dashboardService.GetUserVisitDetail(event.UserId).then((res) => {
      if (!res.Error) {
        this.userVisitDetail=res.List;
      } else {
        this._toastrService.error(res.Message, "Error");
      }
    }).catch((error) => {
      this._toastrService.error(error.message, "Error");
    });
  }
}
