import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ApplicationTypeEnum } from 'src/app/shared/Enums/ApplicationTypeEnum';

@Component({
  selector: 'app-hfzoneadd',
  templateUrl: './hfzoneadd.component.html',
  styleUrls: ['./hfzoneadd.component.scss']
})
export class HfzoneaddComponent implements OnInit {
  HfZoneMode: string = "Zone Health Facility";
  submit: boolean;
  HfZoneForm: FormGroup;
  HealthFacilities: any;
  divisionFiltered: any = [];
  districtFiltered: any = [];
  tehsilFiltered: any = [];
  HFFiltered: any = [];
  ZoneFiltered: any = [];
  Zones: any = [];
  zone: any;
  zoneId: number = 0;
  applicationTypes: any;
  applicationTypeId: string = "";

  public get ApplicationTypeEnum(): typeof ApplicationTypeEnum {
    return ApplicationTypeEnum;
  }

  constructor(public formBuilder: FormBuilder, public loaderService: LoaderService,
    private route: ActivatedRoute, private router: Router, private _profileService: ProfileService,
    private toastr: ToastrService, private _categoryService: CategoryService) { }

  ngOnInit(): void {
    this.GetDropDownValues();
    this.GetApplicationTypes();
    this.CreateFormOnAdd();
  }
  CreateFormOnAdd() {
    this.HfZoneForm = this.formBuilder.group({
      ApplicationTypeId: ['', [Validators.required]],
      DivisionCode: ['', [Validators.required]],
      DistrictCode: [''],
      TehsilCode: [''],
      ZoneId: ['', [Validators.required]],
      HF: ['', [Validators.required]]
    });
  }
  save() {
    if(this.applicationTypeId.toString() == ApplicationTypeEnum.Primary)
    {
      if(!this.HfZoneForm.controls['DistrictCode'].value)
      {
          let DistrictControl = this.HfZoneForm.controls.DistrictCode;
          DistrictControl.setErrors({ required: true });
      }
      // if(!this.HfZoneForm.controls['TehsilCode'].value)
      // {
      //     let TehsilCodeControl = this.HfZoneForm.controls.TehsilCode;
      //     TehsilCodeControl.setErrors({ required: true });
      // }
    }
    if (this.HfZoneForm.valid) {
      this._categoryService.AddZoneHf(this.HfZoneForm.value).then((res) => {
        if (!res.Error) {
          this.toastr.success(res.Message, "Success");
          this.HfZoneForm.reset();
          this.GetDropDownValues();
        } else {
          this.toastr.error(res.Message, "Error");
        }
      }).catch((error) => {
        this.toastr.error(error.message, "Error");
      });
    }
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
    this._profileService.GetHealthFacilities().then((res) => {
      if (!res.Error) {
        this.HealthFacilities = res.List.HealthFacilities;
        this.Zones = res.List.zones;
        this.divisionFiltered = this.HealthFacilities.filter(x => x.lvl == 'Division');
      } else {
        this.toastr.error(res.Message, "Error");
      }
    }).catch((error) => {
      this.toastr.error(error.message, "Error");
    });
  }
  GetDistricts(selectedValue) {
    this.districtFiltered = [];
    this.tehsilFiltered = [];
    this.HFFiltered = [];
    this.ZoneFiltered = [];
    if (selectedValue > 0) {
      this.districtFiltered = this.HealthFacilities.filter(x => x.lvl == 'District' && x.DivisionCode == selectedValue);
    }
    if (parseInt(this.applicationTypeId) > 1) {
      let applicationTypeNames = this.applicationTypes.filter(x => x.ApplicationTypeId == this.applicationTypeId).map(x => x.HfTypeNames);
      let applicationTypeName = applicationTypeNames[0];
      this.ZoneFiltered = this.Zones.filter(x => x.DivisonCode == selectedValue && x.ApplicationTypeId == this.applicationTypeId);
      if (this.zoneId <= 0) {
        this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility' && x.DivisionCode == selectedValue && x.ZoneId == null && applicationTypeName.includes(x.ModeName));
      } else {
        this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility' && x.DivisionCode == selectedValue && (x.ZoneId == null || x.ZoneId == this.zoneId) && applicationTypeName.includes(x.ModeName));
      }
    }
  }
  GetTehsil(selectedValue) {
    this.HFFiltered = [];
    this.ZoneFiltered = [];
    if (selectedValue > 0) {
      debugger;
      let applicationTypeNames = this.applicationTypes.filter(x => x.ApplicationTypeId == this.applicationTypeId).map(x => x.HfTypeNames);
      let applicationTypeName = applicationTypeNames[0];
      this.tehsilFiltered = this.HealthFacilities.filter(x => x.lvl == 'Tehsil' && x.DistrictCode == selectedValue);
      this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility' && x.DistrictCode == selectedValue && x.ZoneId == null && applicationTypeName.includes(x.ModeName));
      this.ZoneFiltered = this.Zones.filter(x => x.DistrictCode == selectedValue);
    }
  }
  // GetHF(selectedValue) {
  //   this.HFFiltered = [];
  //   this.ZoneFiltered = [];
  //   if (selectedValue > 0) {
  //     this.ZoneFiltered = this.Zones.filter(x => x.TehsilCode == selectedValue);
  //     let applicationTypeNames = this.applicationTypes.filter(x => x.ApplicationTypeId == this.applicationTypeId).map(x => x.HfTypeNames);
  //     let applicationTypeName = applicationTypeNames[0];
  //     if (this.zoneId <= 0) {
  //       this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility' && x.TehsilCode == selectedValue && x.ZoneId == null && applicationTypeName.includes(x.ModeName));
  //     } else {
  //       this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility' && x.TehsilCode == selectedValue && (x.ZoneId == null || x.ZoneId == this.zoneId) && applicationTypeName.includes(x.ModeName));
  //     }
  //   }
  // }
  GetZoneHF(selectedValue) {
    let applicationTypeNames = this.applicationTypes.filter(x => x.ApplicationTypeId == this.applicationTypeId).map(x => x.HfTypeNames);
    let applicationTypeName = applicationTypeNames[0];
    if (selectedValue > 0) {
      this.zoneId = selectedValue;
      let districtCode = this.HfZoneForm.controls.DistrictCode.value;
      this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility' && x.DistrictCode == districtCode && (x.ZoneId == null || x.ZoneId == this.zoneId) && applicationTypeName.includes(x.ModeName));
      let hfIds = this.HealthFacilities.filter(x => x.ZoneId == selectedValue).map(a => a.HfId)
      this.HfZoneForm.controls.HF.setValue(hfIds);
    } else {
      let tehsilCode = this.HfZoneForm.controls.TehsilCode.value;
      this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility' && x.TehsilCode == tehsilCode && x.ZoneId == null && applicationTypeName.includes(x.ModeName));
      this.HfZoneForm.controls.HF.setValue('');
    }
    if (parseInt(this.applicationTypeId) > 1) {
      let divisionCode = this.HfZoneForm.controls.DivisionCode.value;
      if (this.zoneId <= 0) {
        this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility' && x.DivisionCode == divisionCode && x.ZoneId == null && applicationTypeName.includes(x.ModeName));
      } else {
        this.HFFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility' && x.DivisionCode == divisionCode && (x.ZoneId == null || x.ZoneId == this.zoneId) && applicationTypeName.includes(x.ModeName));
      }
    }
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
  //#endregion
}
