import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { ToastrService } from 'ngx-toastr';
import { SearchListDTO } from 'src/app/shared/Models/DTO/SearchListDTO';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-bem-onc',
  templateUrl: './bem-onc.component.html',
  styleUrls: ['./bem-onc.component.scss']
})
export class BemOncComponent implements OnInit {
  divisions: Location[];
  districts: Location[];
  tehsils: Location[];
  zones: Location[];
  healthFacilities: any;
  allzones: any;
  filterObj: SearchListDTO = new SearchListDTO();
  hfTypes: any;
  user: any;
  facilitiesBemoOnce: any=[];
  searchForm: FormGroup;
  constructor(public _profileService: ProfileService, 
    public _toastrService: ToastrService, public _authService: AuthService,
    public loaderService:LoaderService,private fb: FormBuilder) {
    this.user = this._authService.currentUser();
  }

  ngOnInit(): void {
    this.GetHealthFacilities();
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
    this.SearchRecord();
  }

  //#regin Dropdown Data
  GetHealthFacilities() {
    this._profileService.GetHealthFacilities().then((res) => {
      if (!res.Error) {
        this.healthFacilities = res.List.HealthFacilities;
        this.allzones = res.List.zones;
        this.hfTypes = res.List.hfTypes;
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
      //this.getMeasEvalutionListByPagination();
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
        break;
    }
  }
  //#endregion

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.filterObj.queryString = val;
    this.filterObj.pageNumber = 0;
    this.GetBemOncRecord();
  }
  SearchRecord() {
    this.filterObj.pageNumber = 0;
    this.GetBemOncRecord();
  }
  GetBemOncRecord(){
    // this._monitoringService.GetAllEvaluations(this.filterObj).then((res) => {
    //   if (!res.Error) {
    //     this.measEvalution = res.Data;
    //     this.filterObj.pageCount = res.PageCount;
    //     this.filterObj.pageNumber = res.PageNumber;
    //     this.filterObj.size = res.Size;
    //     this.filterObj.totalRecords = res.TotalRecords;
    //   } else {
    //     this._toastrService.error(res.Message, "Error");
    //   }
    // });
  }
}
