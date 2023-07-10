import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { ProfileService } from '../../../shared/services/profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../../shared/services/category.service';
import { Paginatedfilterdto } from 'src/app/shared/Models/Paginationfilterdto';
import { ApplicationTypeEnum } from 'src/app/shared/Enums/ApplicationTypeEnum';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HfActiveComponent } from '../hf-active/hf-active.component';

@Component({
  selector: 'app-healthfacilities',
  templateUrl: './healthfacilities.component.html',
  styleUrls: ['./healthfacilities.component.scss']
})
export class HealthfacilitiesComponent implements OnInit {
  
  HfZoneMode: string = "Zone Health Facility";
  submit: boolean;
  HealthFacilities: any;
  divisionFiltered: any = [];
  districtFiltered: any = [];
  tehsilFiltered: any = [];
  HFFiltered: any = [];
  ZoneFiltered: any = [];
  Zones: any = [];
  zoneId: number;
  HfZoneForm: FormGroup;
  filterObj: Paginatedfilterdto = new Paginatedfilterdto();
  start: number;
  end: number;
  currentPageData: any;
  applicationTypes:any;
  applicationTypeId:string;
  bsModalRef: BsModalRef;

  public get ApplicationTypeEnum(): typeof ApplicationTypeEnum {
    return ApplicationTypeEnum;
  }
  
  constructor(public formBuilder: FormBuilder, public loaderService: LoaderService,
    private route: ActivatedRoute, private router: Router, private _profileService: ProfileService,
    private toastr: ToastrService, private _categoryService: CategoryService,private modalService: BsModalService) { }

  ngOnInit(): void {
    this.GetDropDownValues();
    this.GetApplicationTypes();
    this.CreateFormOnAdd();
  }
  CreateFormOnAdd() {
    this.HfZoneForm = this.formBuilder.group({
      ApplicationTypeId:['',Validators.required],
      DivisionCode: ['', [Validators.required]],
      DistrictCode: ['', [Validators.required]],
      TehsilCode: ['', [Validators.required]],
      ZoneId: ['', [Validators.required]],
      HF: ['', [Validators.required]]
    });
  }
  setPage(pageInfo) {
    this.filterObj.pageNumber = parseInt(pageInfo.offset);
    debugger;
    this.start = this.filterObj.pageNumber * this.filterObj.size;
    this.end = (this.filterObj.pageNumber + 1) * this.filterObj.size;
    this.currentPageData = this.HFFiltered.slice(this.start, this.end);
  }
  //#region DropDown Functions
  GetApplicationTypes() {
    this._profileService.GetApplicationTypes().then((res) => {
      if (!res.Error) {
        this.applicationTypes = res.List;
      } else {
        this.toastr.error(res.Message, "Error");
      }
    }).catch((error) => {
      this.toastr.error(error.message, "Error");
    });
  }
  GetDropDownValues() {
    this.districtFiltered = [];
    this.tehsilFiltered = [];
    this.HFFiltered = [];
    this.ZoneFiltered = [];
    this.divisionFiltered = [];
    this._profileService.GetHealthFacilitiesZoneActive().then((res) => {
      if (!res.Error) {
        this.HFFiltered = res.List.HealthFacilities.filter(x => x.lvl == 'HealthFacility');
        this.HealthFacilities = res.List.HealthFacilities;
        this.Zones = res.List.zones;
        this.filterObj.totalRecords = this.HFFiltered.length;
        this.currentPageData = this.HFFiltered;
        this.divisionFiltered = this.HealthFacilities.filter(x => x.lvl == 'Division');
      } else {
        this.toastr.error(res.Message, "Error");
      }
    }).catch((error) => {
      this.toastr.error(error.message, "Error");
    });
  }
  GetDistricts(selectedValue) {
    this.filterObj.pageNumber = 0;
    this.districtFiltered = [];
    this.tehsilFiltered = [];
    this.HFFiltered = [];
    this.ZoneFiltered = [];
    if (selectedValue > 0) {
      this.districtFiltered = this.HealthFacilities.filter(x => x.lvl == 'District' && x.DivisionCode == selectedValue);
      this.HFFiltered = this.HealthFacilities.filter(x => x.DivisionCode == selectedValue && x.lvl == 'HealthFacility');
      this.filterObj.totalRecords = this.HFFiltered.length;
      this.currentPageData = this.HFFiltered;
    }
    if (parseInt(this.applicationTypeId) > 1) {
      let applicationTypeNames = this.applicationTypes.filter(x => x.ApplicationTypeId == parseInt(this.applicationTypeId)).map(x => x.HfTypeNames);
      let applicationTypeName = applicationTypeNames[0];
      this.ZoneFiltered = this.Zones.filter(x => x.DivisonCode == selectedValue && x.ApplicationTypeId == parseInt(this.applicationTypeId));
      if (this.zoneId <= 0) {
        this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility' && x.DivisionCode == selectedValue && applicationTypeName.includes(x.ModeName));
      } else {
        this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility' && x.DivisionCode == selectedValue &&  x.ZoneId == this.zoneId && applicationTypeName.includes(x.ModeName));
      }
      this.filterObj.totalRecords = this.HFFiltered.length;
      this.currentPageData = this.HFFiltered;
    }
  }
  GetTehsil(selectedValue) {
    this.filterObj.pageNumber = 0;
    this.HFFiltered = [];
    this.ZoneFiltered = [];
    this.tehsilFiltered = [];
    if (selectedValue > 0) {
      this.tehsilFiltered = this.HealthFacilities.filter(x => x.lvl == 'Tehsil' && x.DistrictCode == selectedValue);
      this.HFFiltered = this.HealthFacilities.filter(x => x.DistrictCode == selectedValue && x.lvl == 'HealthFacility');
      this.filterObj.totalRecords = this.HFFiltered.length;
      this.currentPageData = this.HFFiltered;
    }
  }
  GetHF(selectedValue) {
    this.filterObj.pageNumber = 0;
    this.HFFiltered = [];
    this.ZoneFiltered = [];
    if (selectedValue > 0) {
      this.ZoneFiltered = this.Zones.filter(x => x.TehsilCode == selectedValue);
      let applicationTypeNames = this.applicationTypes.filter(x => x.ApplicationTypeId == parseInt(this.applicationTypeId)).map(x => x.HfTypeNames);
      let applicationTypeName = applicationTypeNames[0];
      if (this.zoneId <= 0) {
        this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility' && x.TehsilCode == selectedValue && x.ZoneId == null && applicationTypeName.includes(x.ModeName));
      } else {
        this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility' && x.TehsilCode == selectedValue && x.ZoneId == this.zoneId && applicationTypeName.includes(x.ModeName));
      }
      this.filterObj.totalRecords = this.HFFiltered.length;
      this.currentPageData = this.HFFiltered;
    }
  }
  GetZoneHF(selectedValue) {
    this.filterObj.pageNumber = 0;
    let applicationTypeNames = this.applicationTypes.filter(x => x.ApplicationTypeId == this.applicationTypeId).map(x => x.HfTypeNames);
    let applicationTypeName = applicationTypeNames[0];
    let tehsilCode = this.HfZoneForm.controls.TehsilCode.value;
    if (selectedValue > 0) {
      this.zoneId = selectedValue;
      this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility' && x.TehsilCode == tehsilCode && x.ZoneId == this.zoneId);
      this.HFFiltered = this.HealthFacilities.filter(x => x.TehsilCode == tehsilCode && x.ZoneId == this.zoneId && x.lvl == 'HealthFacility');
      this.filterObj.totalRecords = this.HFFiltered.length;
      this.currentPageData = this.HFFiltered;
    } else {

      this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility' && x.TehsilCode == tehsilCode);
      this.HFFiltered = this.HealthFacilities.filter(x => x.TehsilCode == tehsilCode && x.lvl == 'HealthFacility');
      this.filterObj.totalRecords = this.HFFiltered.length;
      this.currentPageData = this.HFFiltered;
    }
    if (parseInt(this.applicationTypeId) > 1) {
      let divisionCode = this.HfZoneForm.controls.DivisionCode.value;
      if (this.zoneId <= 0) {
        this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility' && x.DivisionCode == divisionCode && applicationTypeName.includes(x.ModeName));
      } else {
        this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility' && x.DivisionCode == divisionCode && x.ZoneId == this.zoneId && applicationTypeName.includes(x.ModeName));
      }
      this.filterObj.totalRecords = this.HFFiltered.length;
      this.currentPageData = this.HFFiltered;
    }
  }
  //#endregion
  ToggleActivationHealthFacility(row) {
    this._categoryService.ToggleActivationHF(row.HfId).then((res) => {
      if (!res.Error) {
        this.HealthFacilities = res.Data;
        let divisionCode = this.HfZoneForm.controls.DivisionCode.value;
        let districtCode = this.HfZoneForm.controls.DistrictCode.value;
        let tehsilCode = this.HfZoneForm.controls.TehsilCode.value;
        let zoneCode = this.HfZoneForm.controls.ZoneId.value;
        if (divisionCode) {
          this.HFFiltered = this.HealthFacilities.filter(x => x.DivisionCode == divisionCode && x.lvl == 'HealthFacility');
        }
        if (districtCode) {
          this.HFFiltered = this.HealthFacilities.filter(x => x.DistrictCode == districtCode && x.lvl == 'HealthFacility');
        }
        if (tehsilCode) {
          this.HFFiltered = this.HealthFacilities.filter(x => x.TehsilCode == tehsilCode && x.lvl == 'HealthFacility');
        }
        if (zoneCode) {
          this.HFFiltered = this.HealthFacilities.filter(x => x.ZoneId == zoneCode && x.lvl == 'HealthFacility');
        }
        else {
          this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility');
        }
        this.start = this.filterObj.pageNumber * this.filterObj.size;
        this.end = (this.filterObj.pageNumber + 1) * this.filterObj.size;
        this.currentPageData = this.HFFiltered.slice(this.start, this.end);

        // let hf = this.HFFiltered.find(x => x.HfId == row.HfId);
        // let hfIndex = this.HFFiltered.indexOf(hf);
        // this.HFFiltered[hfIndex].activeFacility = !this.HFFiltered[hfIndex].activeFacility;
        //  hf = this.HealthFacilities.find(x => x.HfId == row.HfId);
        //  hfIndex = this.HealthFacilities.indexOf(hf);
        // this.HealthFacilities[hfIndex].activeFacility = !this.HealthFacilities[hfIndex].activeFacility;
        this.toastr.success(res.Message, "Success");
      } else {
        this.toastr.error(res.Message, "Error");
      }
    }).catch((error) => {
      this.toastr.error(error.message, "Error");
    });
  }
  ShowHideDDL(selectedValue) {
    this.HfZoneForm.controls.DivisionCode.setValue('');
    this.HfZoneForm.controls.DistrictCode.setValue('');
    this.HfZoneForm.controls.TehsilCode.setValue('');
    this.HfZoneForm.controls.ZoneId.setValue('');
    this.HfZoneForm.controls.HF.setValue('');
    this.districtFiltered = [];
    this.tehsilFiltered = [];
    this.ZoneFiltered = [];
    this.HFFiltered = [];
    this.applicationTypeId = selectedValue;
  }
  GetUpdatedData()
  {
    this._profileService.GetHealthFacilitiesZoneActive().then((res) => {
      if (!res.Error) {
        this.HealthFacilities = res.List.HealthFacilities;
        let divisionCode = this.HfZoneForm.controls.DivisionCode.value;
        let districtCode = this.HfZoneForm.controls.DistrictCode.value;
        let tehsilCode = this.HfZoneForm.controls.TehsilCode.value;
        let zoneCode = this.HfZoneForm.controls.ZoneId.value;
        if (divisionCode) {
          this.HFFiltered = this.HealthFacilities.filter(x => x.DivisionCode == divisionCode && x.lvl == 'HealthFacility');
        }
        if (districtCode) {
          this.HFFiltered = this.HealthFacilities.filter(x => x.DistrictCode == districtCode && x.lvl == 'HealthFacility');
        }
        if (tehsilCode) {
          this.HFFiltered = this.HealthFacilities.filter(x => x.TehsilCode == tehsilCode && x.lvl == 'HealthFacility');
        }
        if (zoneCode) {
          this.HFFiltered = this.HealthFacilities.filter(x => x.ZoneId == zoneCode && x.lvl == 'HealthFacility');
        }
        else {
          this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility');
        }
        debugger;
        this.start = this.filterObj.pageNumber * this.filterObj.size;
        this.end = (this.filterObj.pageNumber + 1) * this.filterObj.size;
        this.currentPageData = this.HFFiltered.slice(this.start, this.end);
      } else {
        this.toastr.error(res.Message, "Error");
      }
    }).catch((error) => {
      this.toastr.error(error.message, "Error");
    });
  }
  onSelect(row){
    const initialState = {
      list: [
        row
      ]
    };
 this.bsModalRef = this.modalService.show(HfActiveComponent, { initialState });
    this.bsModalRef.content.event.subscribe(res => {
      debugger;
      this.HealthFacilities = res.res;
        let divisionCode = this.HfZoneForm.controls.DivisionCode.value;
        let districtCode = this.HfZoneForm.controls.DistrictCode.value;
        let tehsilCode = this.HfZoneForm.controls.TehsilCode.value;
        let zoneCode = this.HfZoneForm.controls.ZoneId.value;
        if (divisionCode) {
          this.HFFiltered = this.HealthFacilities.filter(x => x.DivisionCode == divisionCode && x.lvl == 'HealthFacility');
        }
        if (districtCode) {
          this.HFFiltered = this.HealthFacilities.filter(x => x.DistrictCode == districtCode && x.lvl == 'HealthFacility');
        }
        if (tehsilCode) {
          this.HFFiltered = this.HealthFacilities.filter(x => x.TehsilCode == tehsilCode && x.lvl == 'HealthFacility');
        }
        if (zoneCode) {
          this.HFFiltered = this.HealthFacilities.filter(x => x.ZoneId == zoneCode && x.lvl == 'HealthFacility');
        }
        else {
          this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility');
        }
        this.start = this.filterObj.pageNumber * this.filterObj.size;
        this.end = (this.filterObj.pageNumber + 1) * this.filterObj.size;
        this.currentPageData = this.HFFiltered.slice(this.start, this.end);
    });
  }
}
