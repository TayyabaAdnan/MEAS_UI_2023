
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
import { AuthService } from '../../../shared/services/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { ProfileService } from '../../../shared/services/profile.service';
import { SearchListDTO } from '../../../shared/Models/DTO/SearchListDTO';
import { MonitoringService } from "../../../shared/services/monitoring.service";
import * as XLSX from 'xlsx';
import { filter } from 'rxjs/operators';
import { UserService } from 'src/app/shared/services/user.service';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-mea-user-visit',
  templateUrl: './mea-user-visit.component.html',
  styleUrls: ['./mea-user-visit.component.scss']
})
export class MeaUserVisitComponent implements OnInit {
  
  date: Date;
  reorderable = true;
  Modules: any = [];
  divisions: Location[];
  districts: Location[];
  tehsils: Location[];
  zones: Location[];
  searchForm: FormGroup;
  userListExport: any;
  healthFacilities: any;
  allzones: any;
  filterObj: SearchListDTO = new SearchListDTO();
  measUserVisit: any;
  hfTypes: any;
  yList:Array<number>=[];
  mList:any=[];
  year:number;
  shifts: any;
  monthList:[];
  yearList:any;
  user: any;
  isLoadingDD: boolean = true;
  showLoader: boolean = false;
  EXCEL_TYPE:any = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION: any = '.xlsx';
  usersVisits:any;

  constructor(private fb: FormBuilder,
    private _toastrService: ToastrService, public _userService: UserService,
    public _authService: AuthService, public loaderService: LoaderService,
    public _profileService: ProfileService, public _monitoringService: MonitoringService) {
    this.user = this._authService.currentUser();
    this.year = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      divisionId: ["", [Validators.required]],
      districtId: ["", [Validators.required]],
      tehsilId: ["", [Validators.required]],
      ZoneId: ["", Validators.required],
      month: ["", [Validators.required]],
      year: ["", [Validators.required]]
    });
    this._initialize();
    this.GetYearList();
    this.GetMonthList();
  }

  _initialize(): void {
    this.GetHealthFacilities();
    this.getMeasUserVisitListByPagination();
  }

  setPage(pageInfo) {
    this.filterObj.pageNumber = parseInt(pageInfo.offset);
    this.getMeasUserVisitListByPagination();
  }

  getMeasUserVisitListByPagination(): void {
    this._userService.getMEAsUserVisit(this.filterObj).then((res) => {
      if (!res.Error) {
        this.measUserVisit = res.Data;
        this.filterObj.pageCount = res.PageCount;
        this.filterObj.pageNumber = res.PageNumber;
        this.filterObj.size = res.Size;
        this.filterObj.totalRecords = res.TotalRecords;
      } else {
        this._toastrService.error(res.Message, "Error");
      }
    });
  }
  GetYearList() {
    var currentYear = 2021;
    while (currentYear <= this.year) {
      this.yList.push(currentYear);
      currentYear++;
    }
    var dd = this.yList.map(x => ({ name: x.toString() }));
    this.yearList = dd;
    this.isLoadingDD = false;
  }
  GetMonthList(){
   var m = {id:1,name:'January'};
   this.mList.push(m);
   m = {id:2,name:'February'};
   this.mList.push(m);
   m = {id:3,name:'March'};
   this.mList.push(m);
   m = {id:4,name:'April'};
   this.mList.push(m);
   m = {id:5,name:'May'};
   this.mList.push(m);
   m = {id:6,name:'June'};
   this.mList.push(m);
   m = {id:7,name:'July'};
   this.mList.push(m);
   m = {id:8,name:'August'};
   this.mList.push(m);
   m = {id:9,name:'September'};
   this.mList.push(m);
   m = {id:10,name:'October'};
   this.mList.push(m);
   m = {id:11,name:'November'};
   this.mList.push(m);
   m = {id:12,name:'December'};
   this.mList.push(m); 
   var dd = this.mList.map(x => ({ id: x.id.toString(), name: x.name }));
    this.monthList = dd;
    this.isLoadingDD = false;
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.filterObj.queryString = val;
    this.filterObj.pageNumber = 0;
    this.getMeasUserVisitListByPagination();
  }
  SearchRecord() {
    this.filterObj.pageNumber = 0;
    this.getMeasUserVisitListByPagination();
  }

  //#region Populate
  GetHealthFacilities() {
    this._profileService.GetHealthFacilities().then((res) => {
      if (!res.Error) {
        this.healthFacilities = res.List.HealthFacilities;
        this.allzones = res.List.zones;
        this.hfTypes = res.List.hfTypes;
        this.shifts = res.List.shifts;
        this.Modules = res.List.modules.filter(x => x.ApplicationTypeId == 1);
        this.divisions = this.healthFacilities.filter(x => x.lvl == "Division");
        this.PopulateDropdowns();
      } else {
        this._toastrService.error(res.message, "Error");
      }
    }).catch((error) => {
      this._toastrService.error(error.Message, "Error");
    });
  }
  PopulateDropdowns() {
    if (this.user) {
      if (this.user.LocationCode == '') {
        if (this.user.userLocations.length > 0) {
          if (this.user.userLocations[0].length == 3) {
            this.divisions = this.healthFacilities.filter(x => x.lvl == "Division" && this.user.userLocations.includes(x.DivisionCode));
          }
          else if (this.user.userLocations[0].length == 6) {
            this.districts = this.healthFacilities.filter(x => x.lvl == "District" && this.user.userLocations.includes(x.DistrictCode));
          }
          else if (this.user.userLocations[0].length == 9) {
            this.tehsils = this.healthFacilities.filter(x => x.lvl == "Tehsil" && this.user.userLocations.includes(x.TehsilCode));
          }
        }
      }
      else if (this.user.LocationCode.length == 3) {
        this.filterObj.divisionId = this.user.LocationCode;
        this.districts = this.healthFacilities.filter(x => x.lvl == "District" && x.DivisionCode == this.user.LocationCode);
      }
      else if (this.user.LocationCode.length == 6) {
        this.filterObj.districtId = this.user.LocationCode;
        this.tehsils = this.healthFacilities.filter(x => x.lvl == "Tehsil" && x.DistrictCode == this.user.LocationCode);
      }
      else if (this.user.LocationCode.length == 9) {
        this.filterObj.tehsilId = this.user.LocationCode;
        this.zones = this.allzones.filter(x => x.TehsilCode == this.user.LocationCode);
      }
      this.getMeasUserVisitListByPagination();
    }
  }

  HaveAccessTo(dropdowndll) {
    switch (dropdowndll) {
      case "Division":
        if (this.user) {
          if (this.user.LocationCode == '') {
            if (this.user.userLocations.length > 0) {
              if (this.user.userLocations[0].length == 3) {
                return true;
              }
            }
            else {
              return true;
            }
          }
          else if (this.user.LocationCode.length == 3) {
            return false;
          }
          else {
            return false;
          }
        }
        return false;
        break;
      case "District":
        if (this.user) {
          if (this.user.LocationCode == '') {
            if (this.user.userLocations.length > 0) {
              if (this.user.userLocations[0].length == 3) {
                return true;
              }
              if (this.user.userLocations[0].length == 6) {
                return true;
              }
            }
            else {
              return true;
            }
          }
          else if (this.user.LocationCode.length == 3) {
            return false;
          }
          else if (this.user.LocationCode.length == 6) {
            return false;
          }
          else {
            return false;
          }
        }
        return false
        break;
    }

  }
  getDistrictByDivisionId(selectedValue) {
    this.districts = [];
    this.tehsils = [];
    this.zones = [];
    this.filterObj.divisionId = selectedValue;
    this.filterObj.districtId = "";
    this.filterObj.tehsilId = "";
    this.filterObj.ZoneId = "";
    this.districts = this.healthFacilities.filter(x => x.lvl == "District" && x.DivisionCode == selectedValue);
  }
  getTehsilByDistrictId(selectedValue) {
    this.tehsils = [];
    this.zones = [];
    this.filterObj.tehsilId = "";
    this.filterObj.ZoneId = "";
    this.filterObj.districtId = selectedValue;
    this.tehsils = this.healthFacilities.filter(x => x.lvl == "Tehsil" && x.DistrictCode == selectedValue);
  }
  getzoneByTehsilId(selectedValue) {
    this.zones = [];
    this.filterObj.ZoneId = "";
    this.filterObj.tehsilId = selectedValue;
    this.zones = this.allzones.filter(x => x.TehsilCode == selectedValue);
  }
  
  UpdateSearchObject(value, type) {
    switch (type) {
      case 'module':
        this.filterObj.ModuleId = value;
        break;
      case 'Division':
        this.filterObj.divisionId = value;
        this.filterObj.districtId = '';
        this.filterObj.tehsilId = '';
        this.filterObj.ZoneId = '';
        this.filterObj.month = '';
        this.filterObj.year = '';

        break;
      case 'District':
        this.filterObj.districtId = value;
        this.filterObj.tehsilId = '';
        this.filterObj.ZoneId = '';
        this.filterObj.month = '';
        this.filterObj.year = '';
        break;
      case 'Tehsil':
        this.filterObj.tehsilId = value;
        this.filterObj.ZoneId = '';
        this.filterObj.month = '';
        this.filterObj.year = '';
        break;
      case 'Zone':
        this.filterObj.ZoneId = value;
        this.filterObj.month = '';
        this.filterObj.year = '';
        break;
      case 'month':
        this.filterObj.month = value;
        this.filterObj.year = '';
        break;
      case 'year':
        this.filterObj.year = value;
        break;
    }
  }
  
  ExportList(){
    this._userService.getMEAsVisitExport(this.filterObj).then((res) => {
      if (!res.Error) {
        //setTimeout(() => this.ExportExcelEPI(),1000); // 2500 is millisecond
        //this.exportAsExcelFile(this.modulesList, "Recording");
        setTimeout(() => this.exportListExcelFile(res.Data, "MEAsVisits"),1000); // 2500 is millisecond
        this.showLoader = false;

      } else {
        this._toastrService.error(res.msg, 'Error')
      }
    }).catch((error) => {
      this.showLoader = false;
    });
  }
  public exportListExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
     const data: Blob = new Blob([buffer], {type: this.EXCEL_TYPE});
     fileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + this.EXCEL_EXTENSION);
  }
  //#endregion

  //#region Export All Visit List
  ExportAllVisits() {
    this._monitoringService.GetUsersVistsAll(this.filterObj).then((res) => {
      debugger;
      if (!res.Error) {
        this.usersVisits = res.Data;
        setTimeout(() => {
          this.ExportExcel();
        }, 3000);
      }
    });
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
      fileName = this.usersVisits[0].Month + "_" + this.usersVisits[0].Year + "_Users Visits.xlsx";
    }
    XLSX.writeFile(wb, fileName);
  }
  //#endregion

}
