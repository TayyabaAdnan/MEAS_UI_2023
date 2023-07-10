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

@Component({
  selector: 'app-monitoringlist',
  templateUrl: './monitoringlist.component.html',
  styleUrls: ['./monitoringlist.component.scss']
})
export class MonitoringlistComponent implements OnInit {
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
  measEvalution: any;
  measEvalutionAll: any;
  measEvalutionAllDetail: any;
  questions: any;
  hfTypes: any;
  shifts: any;
  selectedShifts: any;
  exportTypeValue: number = 0;
  user: any;
  constructor(private fb: FormBuilder,
    private router: Router, private _toastrService: ToastrService,
    public _authService: AuthService, public loaderService: LoaderService,
    public _profileService: ProfileService, public _monitoringService: MonitoringService) {
    this.user = this._authService.currentUser();
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      moduleId: [""],
      divisionId: ["", [Validators.required]],
      districtId: ["", [Validators.required]],
      tehsilId: ["", [Validators.required]],
      ZoneId: ["", Validators.required],
      HfTypeId: [""],
      fromDate: ["", [Validators.required]],
      toDate: ["", [Validators.required]]
    });
    this._initialize();
  }
  _initialize(): void {
    this.GetHealthFacilities();
    this.getMeasEvalutionListByPagination();
  }
  setPage(pageInfo) {
    this.filterObj.pageNumber = parseInt(pageInfo.offset);
    this.getMeasEvalutionListByPagination();
  }
  getMeasEvalutionListByPagination(): void {
    this._monitoringService.GetAllEvaluations(this.filterObj).then((res) => {
      if (!res.Error) {
        this.measEvalution = res.Data;
        this.filterObj.pageCount = res.PageCount;
        this.filterObj.pageNumber = res.PageNumber;
        this.filterObj.size = res.Size;
        this.filterObj.totalRecords = res.TotalRecords;
      } else {
        this._toastrService.error(res.Message, "Error");
      }
    });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.filterObj.queryString = val;
    this.filterObj.pageNumber = 0;
    this.getMeasEvalutionListByPagination();
  }
  SearchRecord() {
    this.filterObj.pageNumber = 0;
    this.getMeasEvalutionListByPagination();
  }

  //#region Populate
  GetHealthFacilities() {
    debugger;
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
      this.getMeasEvalutionListByPagination();
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
  updateFromDate(event) {
    const val = event.target.value;
    this.filterObj.fromDate = val;
  }
  updateToDate(event) {
    const val = event.target.value;
    this.filterObj.toDate = val;
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
        break;
      case 'District':
        this.filterObj.districtId = value;
        this.filterObj.tehsilId = '';
        this.filterObj.ZoneId = '';
        break;
      case 'Tehsil':
        this.filterObj.tehsilId = value;
        this.filterObj.ZoneId = '';
        break;
      case 'Zone':
        this.filterObj.ZoneId = value;
        break;
      case 'HfType':
        this.filterObj.HfTypeId = value;
        this.selectedShifts = this.shifts.filter(x => x.HFTypeId == value);
        break;
      case 'Shift':
        this.filterObj.ShiftId = value;
        break;
    }
  }
  onSelect(monitoringMast) {
    this.router.navigate(["/evaluation/detail/" + monitoringMast.Id]);
  }
  ExportList() {
    this._monitoringService.GetAllEvaluationsWithoutPagination(this.filterObj).then((res) => {
      if (!res.Error) {
        this.measEvalutionAll = res.Data;
        var shitname = "";
        var HFTypeName = "";
        var filename = "";
        var date = new Date();
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();

        var currentdate = yyyy + '' + mm + '' + dd;
        if (this.filterObj.HfTypeId != null && this.filterObj.HfTypeId != "") {
          var HFT = this.hfTypes.find(x => x.FacilityTypeId == this.filterObj.HfTypeId);
          HFTypeName = HFT.FaciltyTypeName;
        }
        if (this.filterObj.ShiftId != null && this.filterObj.ShiftId != "") {
          var shift = this.shifts.find(x => x.ShiftId == this.filterObj.ShiftId && x.HFTypeId == this.filterObj.HfTypeId);
          shitname = shift.ShiftName;
          shitname = shitname.split(" ", 1)[0];
        }
        if (HFTypeName != "" && shitname != "") {
          filename = currentdate + "_mea_visits_" + HFTypeName + "_" + shitname

        }
        else {

          filename = currentdate + "_mea_visits_All";

        }
        setTimeout(() => this.ExportExcelNew("tblDetail", filename), 1000);
      }
      else {
        this._toastrService.error(res.Message, "Error");
      }
    });

  }
  ExportMonitoringList() {
    this._monitoringService.GetMonitoringEvaluationsDetailWithoutPagination(this.filterObj).then((res) => {
      if (!res.Error) {
        debugger;
        this.measEvalutionAllDetail = res.List.monitoringMasterExportsList;
        this.questions = res.List.Questions;
        var shitname = "";
        var HFTypeName = "";
        var filename = "";
        var date = new Date();
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();

        var currentdate = yyyy + '' + mm + '' + dd;
        if (this.filterObj.HfTypeId != null && this.filterObj.HfTypeId != "") {
          var HFT = this.hfTypes.find(x => x.FacilityTypeId == this.filterObj.HfTypeId);
          HFTypeName = HFT.FaciltyTypeName;
        }
        if (this.filterObj.ShiftId != null && this.filterObj.ShiftId != "") {
          var shift = this.shifts.find(x => x.ShiftId == this.filterObj.ShiftId && x.HFTypeId == this.filterObj.HfTypeId);
          shitname = shift.ShiftName;
          shitname = shitname.split(" ", 1)[0];

        }
        if (HFTypeName != "" && shitname != "") {
          filename = currentdate + "_mea_visits_monitoring_" + HFTypeName + "_" + shitname

        }
        else {

          filename = currentdate + "_mea_visits_monitoring_All";

        }
        console.log(this.measEvalutionAllDetail);
        setTimeout(() => this.ExportExcelNew("tblExportAllMonitoring", filename), 7000);


        // setTimeout(() => this.ExportExcel("tblExportAllMonitoring"), 7000);
      }

      //setTimeout(() => this.ExportExcel("tblExportAllMonitoring"), 7000);

    });
  }
  ExportMonitoringAttendanceList() {
    this._monitoringService.GetMonitoringEvaluationAttendanceExport(this.filterObj).then((res) => {
      if (!res.Error) {
        this.exportTypeValue = 2;
        this.measEvalutionAllDetail = res.List;
        this.questions = [];
        var shitname = "";
        var HFTypeName = "";
        var filename = "";
        var date = new Date();
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();

        var currentdate = yyyy + '' + mm + '' + dd;
        if (this.filterObj.HfTypeId != null && this.filterObj.HfTypeId != "") {
          var HFT = this.hfTypes.find(x => x.FacilityTypeId == this.filterObj.HfTypeId);
          HFTypeName = HFT.FaciltyTypeName;
        }
        if (this.filterObj.ShiftId != null && this.filterObj.ShiftId != "") {
          var shift = this.shifts.find(x => x.ShiftId == this.filterObj.ShiftId && x.HFTypeId == this.filterObj.HfTypeId);
          shitname = shift.ShiftName;
          shitname = shitname.split(" ", 1)[0];

        }
        if (HFTypeName != "" && shitname != "") {
          filename = currentdate + "_mea_visits_attendance_" + HFTypeName + "_" + shitname

        }
        else {

          filename = currentdate + "_mea_visits_attendance_All";

        }
        console.log(this.measEvalutionAllDetail);
        setTimeout(() => this.ExportExcelNew("tblExportAllMonitoring", filename), 7000);


        // setTimeout(() => this.ExportExcel("tblExportAllMonitoring"), 7000);
      }
    });
  }
  ExportCVCList() {
    //  this._monitoringService.GetAllEvaluationsDetailWithoutPagination(this.filterObj).then((res) => {
    this._monitoringService.GetMonitoringEvaluationsDetailWithoutPagination(this.filterObj).then((res) => {
      if (!res.Error) {
        debugger;
        this.measEvalutionAllDetail = res.List.monitoringMasterExportsList;
        this.questions = res.List.Questions;
        var shitname = "";
        var HFTypeName = "";
        var filename = "";
        var date = new Date();
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();

        var currentdate = yyyy + '' + mm + '' + dd;
        if (this.filterObj.HfTypeId != null && this.filterObj.HfTypeId != "") {
          var HFT = this.hfTypes.find(x => x.FacilityTypeId == this.filterObj.HfTypeId);
          HFTypeName = HFT.FaciltyTypeName;
        }
        if (this.filterObj.ShiftId != null && this.filterObj.ShiftId != "") {
          var shift = this.shifts.find(x => x.ShiftId == this.filterObj.ShiftId && x.HFTypeId == this.filterObj.HfTypeId);
          shitname = shift.ShiftName;
          shitname = shitname.split(" ", 1)[0];

        }
        if (HFTypeName != "" && shitname != "") {
          filename = currentdate + "_mea_visits_cvc_" + HFTypeName + "_" + shitname

        }
        else {

          filename = currentdate + "_mea_visits_cvc_All";

        }
        console.log(this.measEvalutionAllDetail);
        setTimeout(() => this.ExportExcelNew("tblExportAllMonitoring", filename), 7000);


        // setTimeout(() => this.ExportExcel("tblExportAllMonitoring"), 7000);
      }
    });
  }
  ExportExcelNew(tableName, filename) {
    let element = document.getElementById(tableName);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, filename + ".xlsx");
  }

  ExportExcel(tableName) {

    let element = document.getElementById(tableName);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, "MonitoringList.xlsx");
  }
  //#endregion

  //#region 
  ChangeDDLValue(value: string) {
    this.exportTypeValue = parseInt(value);

  }
  ExportData() {
    // if (this.exportTypeValue > 0) {
    //   switch (this.exportTypeValue) {
    //     case 1:
    //       this.ExportMonitoringList();
    //       break;
    //     case 2:
    //       this.ExportMonitoringAttendanceList();
    //       break;
    //     case 3:
    //       this.ExportCVCList();
    //       break;
    //     case 4:
    //       this.ExportList();
    //       break;
    //   }
    // } else {
    //   this._toastrService.error("Please Select Type Of Export");
    // }
    if (parseInt(this.filterObj.ModuleId) > 0) {
      switch (parseInt(this.filterObj.ModuleId)) {
        case 1:
          this.ExportMonitoringList();
          break;
        case 11:
          this.ExportCVCList();
          break;
        case 15:
          this.ExportMonitoringAttendanceList();
          break;
      }
    } else {
      this._toastrService.error("Please Select Type Of Export");
    }
  }
  //#endregion

}
