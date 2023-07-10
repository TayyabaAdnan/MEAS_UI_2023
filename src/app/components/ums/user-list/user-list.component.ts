import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/Models/User';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
import { UserTypeEnum } from 'src/app/shared/Enums/UserTypeEnum';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoaderService } from 'src/app/shared/services/loader.service';
import * as XLSX from 'xlsx';
import { ProfileService } from 'src/app/shared/services/profile.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  user: User;
  userlist: any;
  loading: boolean;
  private isLoading: boolean = false;
  reorderable = true;
  roleName: string;
  CurrentUser: any;
  divisions: Location[];
  districts: Location[];
  tehsils: Location[];
  zones: Location[];
  searchForm: FormGroup;
  userListExport: any;
  healthFacilities: any;
  allzones: any;

  constructor(private fb: FormBuilder, public _useService: UserService,
    private router: Router, private _toastrService: ToastrService,
    public _authService: AuthService, public loaderService: LoaderService,
    public _profileService: ProfileService) {
    this.CurrentUser = _authService.currentUser();
    if (this.CurrentUser) {
      this.roleName = this.CurrentUser.UserRole;
    }
  }

  public get UserTypeEnum(): typeof UserTypeEnum {
    return UserTypeEnum;
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      divisionId: ["", [Validators.required]],
      districtId: ["", [Validators.required]],
      tehsilId: ["", [Validators.required]],
      ZoneId: ["", Validators.required]
    });
    this._initialize();
  }
  _initialize(): void {
    this.GetHealthFacilities();
    this.getUserListByPagination();
  }
  setPage(pageInfo) {
    this._useService.filterObj.pageNumber = parseInt(pageInfo.offset);
    this.getUserListByPagination();
  }
  getUserListByPagination(): void {
    this._useService.getByFilter().then((res) => {
      if (!res.Error) {
        this._useService.userlist = res.Data;
        this._useService.filterObj.pageCount = res.PageCount;
        this._useService.filterObj.pageNumber = res.PageNumber;
        this._useService.filterObj.size = res.Size;
        this._useService.filterObj.totalRecords = res.TotalRecords;
      } else {
        this._toastrService.error(res.message, "Error");
      }
    });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this._useService.filterObj.queryString = val;
    this._useService.filterObj.pageNumber = 0;
    this.getUserListByPagination();
  }
  createUser() {
    this.router.navigate(['/ums/user']);
  }
  onSelect(row) {
    this.router.navigate(["/ums/user/" + row.UserId]);
  }
  public ToggleActivationUser(row) {
    this._useService.ToggleActivationUser(row).then((res) => {
      if (!res.Error) {
        this._toastrService.success(res.Message, "");
        this.getUserListByPagination();
      } else {
        this._toastrService.error(res.Message, "Error");
      }
    }).catch((error) => {
      this._toastrService.error(error.Message, "Error");
    });
  }
  public DeleteUser(row) {
    this._useService.DeleteUser(row).then((res) => {
      if (!res.Error) {
        this._toastrService.success(res.Message, "");
        this.getUserListByPagination();
      } else {
        this._toastrService.error(res.Message, "Error");
      }
    }).catch((error) => {
      this._toastrService.error(error.Message, "Error");
    });
  }
  SearchRecord() {
    this._useService.filterObj.pageNumber = 0;
    this.getUserListByPagination();
  }
  //#region Populate
  GetHealthFacilities() {
    this._profileService.GetHealthFacilities().then((res) => {
      if (!res.Error) {
        this.healthFacilities = res.List.HealthFacilities;
        this.allzones = res.List.zones;
        this.divisions = this.healthFacilities.filter(x => x.lvl == "Division");
      } else {
        this._toastrService.error(res.message, "Error");
      }
    }).catch((error) => {
      this._toastrService.error(error.Message, "Error");
    });
  }
  getDistrictByDivisionId(selectedValue) {
    this.districts = [];
    this.tehsils = [];
    this.zones = [];
    this._useService.filterObj.divisionId=selectedValue;
    this._useService.filterObj.districtId="";
    this._useService.filterObj.tehsilId="";
    this._useService.filterObj.ZoneId="";
    this.districts = this.healthFacilities.filter(x => x.lvl == "District" && x.DivisionCode == selectedValue);
  }
  getTehsilByDistrictId(selectedValue) {
    this.tehsils = [];
    this.zones = [];
    this._useService.filterObj.tehsilId="";
    this._useService.filterObj.ZoneId="";
    this._useService.filterObj.districtId=selectedValue;
    this.tehsils = this.healthFacilities.filter(x => x.lvl == "Tehsil" && x.DistrictCode == selectedValue);
  }
  getzoneByTehsilId(selectedValue) {
    this.zones = [];
    this._useService.filterObj.ZoneId="";
    this._useService.filterObj.tehsilId=selectedValue;
    this.zones = this.allzones.filter(x => x.TehsilCode == selectedValue);
  }

  UpdateSearchObject(value, type) {
    switch (type) {
      case 'Division':
        this._useService.filterObj.divisionId = value;
        this._useService.filterObj.districtId = '';
        this._useService.filterObj.tehsilId = '';
        this._useService.filterObj.ZoneId = '';
        break;
      case 'District':
        this._useService.filterObj.districtId = value;
        this._useService.filterObj.tehsilId = '';
        this._useService.filterObj.ZoneId = '';
        break;
      case 'Tehsil':
        this._useService.filterObj.tehsilId = value;
        this._useService.filterObj.ZoneId = '';
        break;
      case 'Zone':
        this._useService.filterObj.ZoneId = value;
        break;
    }
  }
  HaveAccessTo(dropdownType) {
    switch (dropdownType) {
      case "Province":
        if (this.roleName == UserTypeEnum.SuperAdmin || this.roleName == UserTypeEnum.FedralUser)
          return true; else return false;
        break;
      case "Division":
        if (this.roleName == UserTypeEnum.SuperAdmin || this.roleName == UserTypeEnum.FedralUser || this.roleName == UserTypeEnum.ProvisionalUser)
          return true; else return false;
        break;
      case "District":
        if (this.roleName == UserTypeEnum.SuperAdmin || this.roleName == UserTypeEnum.FedralUser || this.roleName == UserTypeEnum.ProvisionalUser || this.roleName == UserTypeEnum.DivisionalUser)
          return true; else return false;
        break;
      case "Tehsil":
        if (this.roleName == UserTypeEnum.SuperAdmin || this.roleName == UserTypeEnum.FedralUser || this.roleName == UserTypeEnum.ProvisionalUser || this.roleName == UserTypeEnum.DivisionalUser || this.roleName == UserTypeEnum.DistrictUser)
          return true; else return false;
        break;
      case "UnionCouncil":
        if (this.roleName != UserTypeEnum.UnionCouncilUser)
          return true; else return false;
        break;
    }
  }
  //#endregion

  //#region Export
  ExportList() {
    this._useService.ExportUserList().then((res) => {
      if (!res.Error) {
        this.userListExport = res.Data;
        setTimeout(() => this.ExportExcel(), 1000);
      } else {
        this._toastrService.error(res.Message, 'Error')
      }
    }).catch((error) => {
      this._toastrService.error(error, 'Error')
    });
  }
  ExportExcel() {

    let element = document.getElementById("tblUser");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    var colNum = XLSX.utils.decode_col("K"); //decode_col converts Excel col name to an integer for col #
    var range = XLSX.utils.decode_range(ws['!ref']);
    for (var i = range.s.r + 1; i <= range.e.r; ++i) {
      var ref = XLSX.utils.encode_cell({ r: i, c: colNum });
      if (!ws[ref]) continue;
      if (ws[ref].t != 'n') continue;
      ws[ref].t = "s"
    }
    colNum = XLSX.utils.decode_col("L"); //decode_col converts Excel col name to an integer for col #
    var range = XLSX.utils.decode_range(ws['!ref']);
    for (var i = range.s.r + 1; i <= range.e.r; ++i) {
      var ref = XLSX.utils.encode_cell({ r: i, c: colNum });
      if (!ws[ref]) continue;
      if (ws[ref].t != 'n') continue;
      ws[ref].t = "s"
    }
    colNum = XLSX.utils.decode_col("J"); //decode_col converts Excel col name to an integer for col #
    var range = XLSX.utils.decode_range(ws['!ref']);
    for (var i = range.s.r + 1; i <= range.e.r; ++i) {
      var ref = XLSX.utils.encode_cell({ r: i, c: colNum });
      if (!ws[ref]) continue;
      if (ws[ref].t != 'n') continue;
      ws[ref].t = "s"
    }
    XLSX.writeFile(wb, "Users List.xlsx");
  }
  //#endregion
}
