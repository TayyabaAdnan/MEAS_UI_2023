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
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-monitoringlistnew',
  templateUrl: './monitoringlistnew.component.html',
  styleUrls: ['./monitoringlistnew.component.scss']
})
export class MonitoringlistnewComponent implements OnInit {

  date: Date;
  reorderable = true;
  Modules: any = [];
  applications: any = [];
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
  measEvalutionAllNew: any;
  measEvalutionAllDetail: any;
  questions: any;
  hfTypes: any;
  shifts: any;
  selectedShifts: any;
  exportTypeValue: number = 0;
  user: any;
  radiovalue: number;

  counttyp: number = 0;
  hftyp: number = 0;
  hfstatus: number = 2; 

  indicatorForm: FormGroup;
  HFTypeList:any;
  HFTypeFilteredList:any;
  Shifts:any;
  ApplicationTypes:any;
  HealthFacilities:any;
  ModulesSelected:any;
  HfFiltered:any;
  shiftsFiltered:any;
  indicators:any;

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private router: Router, private _toastrService: ToastrService,
    public _authService: AuthService, public loaderService: LoaderService,
    public _profileService: ProfileService, public _monitoringService: MonitoringService) {
    this.user = this._authService.currentUser();
  }

  ngOnInit(): void {
    debugger;
   // path: 'list-new/:type/:hftype/:status',
   // all open today 1/0/1
   //<!--  open=1, close=2, 'list-new/:type(today=1 or weekly=2 or monthly=3 or total=4, ALL=0)/:hftype(BHU=1, BHU24/7=3, RHC=4, ALL=0)/:status(open=1, close=2, All=0)' -->
   var today = new Date();
    this.counttyp = Number(this.route.snapshot.paramMap.get('type'));
    this.hftyp = Number(this.route.snapshot.paramMap.get('hftype'));
    this.hfstatus = Number(this.route.snapshot.paramMap.get('status'));

    console.log(this.counttyp);
    console.log(this.hftyp);
    console.log(this.hfstatus);

    this.searchForm = this.fb.group({
      applicationId: [""],
      moduleId: [""],
      divisionId: ["", [Validators.required]],
      districtId: ["", [Validators.required]],
      tehsilId: ["", [Validators.required]],
      ZoneId: ["", Validators.required],
      HfTypeId: [""],
      fromDate: ["", [Validators.required]],
      toDate: ["", [Validators.required]],
      type: this.counttyp
    });


    var todayy = new Date();
    var firstt = todayy.getDate() - todayy.getDay() + 1;
    var monday = new Date(todayy.setDate(firstt));
    var lasst = firstt + 6;
    var sunday = new Date(todayy.setDate(lasst));

  //  var firstDay = new Date(todayy.getFullYear(), todayy.getMonth(), 1);
  //  var lastDay = new Date(todayy.getFullYear(), todayy.getMonth() + 1, 0);

    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    console.log(firstDay);
    console.log(lastDay);

    if (this.radiovalue == null){
      this.radiovalue = 1;
    }
/* var curr = new Date(today); // get current date
var first = today.getDate() - today.getDay(); // First day is the day of the month - the day of the week
var diff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : -1);
//var last = first + 6; // last day is the first day + 6
var last = first + 6; // last day is the first day + 6
var firstday = new Date(curr.setDate(diff));
var lastday = new Date(firstday.setDate(last)); 

/* var firstday = new Date(curr.setDate(first)); // 06-Jul-2014
var lastday = new Date(firstday.setDate(last)); // 12-Jul-2014 */

//var lastday1 = curr.getDate() - (curr.getDay() - 1) + 6;  
//var lastdayy = new Date(firstday.setDate(lastday1));  
console.log(this.counttyp);
    if (this.counttyp==1)
    {      
        this.filterObj.fromDate = today;
        this.filterObj.toDate = today;
        this.filterObj.type = 1;
    }
    else if (this.counttyp==2)
    {    
        this.filterObj.fromDate = monday;
        this.filterObj.toDate = sunday;         
        this.filterObj.type =2;
    }
    else if (this.counttyp==3)
    {      
        this.filterObj.type =3;
        this.filterObj.fromDate = firstDay;
        this.filterObj.toDate = lastDay;   
    }
    else if (this.counttyp==4)
    {      
        this.filterObj.type =4;
        this.filterObj.fromDate = null;
        this.filterObj.toDate = null;   
    }
    else if (this.counttyp==0)
    {      
        this.filterObj.type =0;
        this.filterObj.fromDate = firstDay;
        this.filterObj.toDate = lastDay;   
    }

    if (this.hftyp==1){
      this.filterObj.HfTypeId = "1";
    }
    else if(this.hftyp==3){
      this.filterObj.HfTypeId = "3";
    }
    else if(this.hftyp==4){
      this.filterObj.HfTypeId = "4";
    }
    else if(this.hftyp==0){
      this.filterObj.HfTypeId = "0";
    }        

    if (this.radiovalue == null){
      this.radiovalue = 1;
    }

    if (this.hfstatus == 2){
      this.InputChanged(2);
    }
    else if (this.hfstatus == 1){
      this._initialize();
    }
    else{
      this._initialize();
    }
  }
  _initialize(): void {
  
    this.getMeasEvalutionListByPagination();
    this.GetHealthFacilities();
  }
  setPage(pageInfo) {
    this.filterObj.pageNumber = parseInt(pageInfo.offset);
    this.getMeasEvalutionListByPagination();
  }

  public InputChanged(type: number) {
    debugger;
    if (type == 1) {
      this.radiovalue = 1;
      this.getMeasEvalutionListByPagination();
    } 
    else if (type == 2) {
      this.radiovalue = 2;
     this.getCloseMeasEvalutionListByPagination();
    } 
    }
 

  getMeasEvalutionListByPagination(): void {
    debugger;
    this._monitoringService.GetAllEvaluationsNew(this.filterObj).then((res) => {
      debugger;
      if (!res.Error) {
        debugger;
        this.measEvalution = res.Data;
        this.filterObj.pageCount = res.PageCount;
        this.filterObj.pageNumber = res.PageNumber;
        this.filterObj.size = res.Size;
        this.filterObj.totalRecords = res.TotalRecords;
      } else {
        this._toastrService.error(res.Message, "Error");
      }
    });
    //
   
    //SearchListDTO = new SearchListDTO();
  }
  GetModules(selectedValue)
  {
    debugger;
    this.ModulesSelected=[];
    this.HFTypeFilteredList=[];
    if(selectedValue > 0)
    {
      var hftyPes = this.ApplicationTypes.filter(x => x.ApplicationTypeId  == selectedValue).map(a => a.HfTypeIds);
      let hType= hftyPes[0];
      this.HFTypeFilteredList= this.HFTypeList.filter(x => hType.includes(x.FacilityTypeId));
      this.ModulesSelected = this.Modules.filter(x => x.ApplicationTypeId == selectedValue);
    }
  }
  getCloseMeasEvalutionListByPagination(): void {
    debugger;
    this._monitoringService.GetAllCloseEvaluationsNew(this.filterObj).then((res) => {
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
        this.Modules = res.List.modules;
        debugger;
        this.applications = res.List.applications;
        this.divisions = this.healthFacilities.filter(x => x.lvl == "Division");
        this.PopulateDropdowns();
      } else {
        this._toastrService.error(res.message, "Error");
      }
    }).catch((error) => {
      this._toastrService.error(error.Message, "Error");
    });
  }
  PopulateDropdowns  () {
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
    this.router.navigate(["/evaluation/detail-new/" + monitoringMast.Id]);
   // this.router.navigate(["/evaluation/detail/" + monitoringMast.Id]);
  }

  Refresh(){
    this.router.navigate(["/evaluation/list-new"]);
  }
  ExportList() {
    debugger;
    if (this.radiovalue == 1){

    this._monitoringService.GetAllEvaluationsWithoutPaginationDataTable(this.filterObj).then((res) => {
      if (!res.Error) {
        this.measEvalutionAll = res.Data;
        var shitname = "";
        var HFTypeName = "";
        var filename = "";
        var date = new Date();
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();
debugger;
        var currentdate = yyyy + '' + mm + '' + dd;
        if (this.filterObj.HfTypeId != null && this.filterObj.HfTypeId != "" && this.filterObj.HfTypeId != "0") {
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
  else if (this.radiovalue == 2){

 
  this._monitoringService.GetCloseAllEvaluationsWithoutPaginationDataTable(this.filterObj).then((res) => {
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
      if (this.filterObj.HfTypeId != null && this.filterObj.HfTypeId != "" && this.filterObj.HfTypeId != "0") {
        var HFT = this.hfTypes.find(x => x.FacilityTypeId == this.filterObj.HfTypeId);
        HFTypeName = HFT.FaciltyTypeName;
      }
      if (this.filterObj.ShiftId != null && this.filterObj.ShiftId != "") {
        var shift = this.shifts.find(x => x.ShiftId == this.filterObj.ShiftId && x.HFTypeId == this.filterObj.HfTypeId);
        shitname = shift.ShiftName;
        shitname = shitname.split(" ", 1)[0];
      }
      if (HFTypeName != "" && shitname != "") {
        filename = currentdate + "_mea_close_visits_" + HFTypeName + "_" + shitname

      }
      else {

        filename = currentdate + "_mea_close_visits_All";

      }
      setTimeout(() => this.ExportExcelNew("tblDetail", filename), 1000);
    }
    else {
      this._toastrService.error(res.Message, "Error");
    }
  });
  }
}
  /* ExportListNew() {
    debugger;
   
    this._monitoringService.GetAllEvaluationsWithoutPaginationNew(this.filterObj).then((res) => {
      console.log(res);
      if (!res.Error) {

        debugger;
        this.measEvalutionAllNew = res.Data;
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
        setTimeout(() => this.ExportExcelNew("tblExportAllMonitoring", filename), 1000);
      }
      else {
        this._toastrService.error(res.Message, "Error");
      }
    });

  } */
 

  ExportAllListNew() {
    debugger;
    this._monitoringService.GetAllEvaluationsWithoutPaginationNew(this.filterObj).then((res) => {
      debugger;
      console.log(res);
      if (!res.Error) {
        debugger;

        this.measEvalutionAllNew = res.List.AllDataExportList;
        console.log(res.List.AllDataExportList);
        this.questions = res.List.Questions;
        var shitname = "";
        var HFTypeName = "";
        var ModName = "";
        var filename = "";
        var date = new Date();
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();

        var currentdate = yyyy + '' + mm + '' + dd;
        if (this.filterObj.HfTypeId != null && this.filterObj.HfTypeId != "" && this.filterObj.HfTypeId != "0") {
          var HFT = this.hfTypes.find(x => x.FacilityTypeId == this.filterObj.HfTypeId);
          HFTypeName = HFT.FaciltyTypeName;
        }
        if (this.filterObj.ShiftId != null && this.filterObj.ShiftId != "") {
          var shift = this.shifts.find(x => x.ShiftId == this.filterObj.ShiftId && x.HFTypeId == this.filterObj.HfTypeId);
          shitname = shift.ShiftName;
          shitname = shitname.split(" ", 1)[0];

        }
        if (this.filterObj.ModuleId != null) {
          debugger;
          var module = this.Modules.find(x => x.ModuleId == this.filterObj.ModuleId);
          ModName = module.ModuleName;
        }

        if(ModName != "" && HFTypeName == "" && shitname == ""){
          filename = currentdate + "_mea_visits_" + ModName
        }
        else if(ModName != "" && HFTypeName != "" && shitname != ""){
          filename = currentdate + "_mea_visits_" + ModName + "_" + HFTypeName + "_" + shitname
        }
        else if (ModName == "" && HFTypeName != "" && shitname != "") {
          filename = currentdate + "_mea_visits_" + HFTypeName + "_" + shitname

        }
        else {

          filename = currentdate + "_mea_visits_All";

        }
        console.log(this.measEvalutionAllNew);
        setTimeout(() => this.ExportExcelNew("tblExportAllNew", filename), 7000);


        // setTimeout(() => this.ExportExcel("tblExportAllMonitoring"), 7000);
      }

      //setTimeout(() => this.ExportExcel("tblExportAllMonitoring"), 7000);

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
        if (this.filterObj.HfTypeId != null && this.filterObj.HfTypeId != ""  && this.filterObj.HfTypeId != "0") {
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
  ExportMonitoringAttendanceListNew() {
    this._monitoringService.GetMonitoringEvaluationAttendanceExportNew(this.filterObj).then((res) => {
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
        if (this.filterObj.HfTypeId != null && this.filterObj.HfTypeId != ""  && this.filterObj.HfTypeId != "0") {
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
        if (this.filterObj.HfTypeId != null && this.filterObj.HfTypeId != "" && this.filterObj.HfTypeId != "0") {
          var HFT = this.hfTypes.find(x => x.FacilityTypeId == this.filterObj.HfTypeId);
          HFTypeName = HFT.FaciltyTypeName;
        }
        if (this.filterObj.ShiftId 
          != null && this.filterObj.ShiftId != "") {
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
  //  XLSX.utils.sheet_to_txt(wb, ws, 'Sheet1');
   // book_append_sheet(workbook: WorkBook, worksheet: WorkSheet, name?: string): void;
    //sheet_to_txt
    /* save to file */
   XLSX.writeFile(wb, filename + ".xlsx");
  //this.wb.numberFormat(
   // XLSX.writeFile(wb, filename + ".csv");
  }

  ExportExcel(tableName) {

    let element = document.getElementById(tableName);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    wb.Sheets.cells.NumberFormat = "@";
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
          this.ExportMonitoringAttendanceListNew();
          break;
      }
    } else {
      this._toastrService.error("Please Select Type Of Export");
    }
  }
  //#endregion
}
