import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ApplicationTypeEnum } from 'src/app/shared/Enums/ApplicationTypeEnum';

@Component({
  selector: 'app-zoneadd',
  templateUrl: './zoneadd.component.html',
  styleUrls: ['./zoneadd.component.scss']
})
export class ZoneaddComponent implements OnInit {
  ZoneMode: string = "Add Zone";
  submit: boolean;
  ZoneForm: FormGroup;
  applicationTypes: any;
  HealthFacilities: any;
  divisionFiltered: any = [];
  districtFiltered: any = [];
  tehsilFiltered: any = [];
  zone: any;
  zoneId: any;
  applicationTypeId: string ="";

  constructor(public formBuilder: FormBuilder, public loaderService: LoaderService,
    private route: ActivatedRoute, private router: Router, private _profileService: ProfileService,
    private toastr: ToastrService, private _categoryService: CategoryService) { }
   
    public get ApplicationTypeEnum(): typeof ApplicationTypeEnum {
      return ApplicationTypeEnum;
    }
  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('zoneId');
    this.submit = false;
    this.GetDropDownValues();
    this.GetApplicationTypes();
    this.CreateFormOnAdd();
    if (id) {
      this.ZoneMode = "Update Zone";
      this.zoneId = parseInt(id);
      this._categoryService.GetZoneById(Number(this.zoneId)).then(res => {
        if (!res.Error) {
          this.zone = res.Data;
          this.applicationTypeId = this.zone.ApplicationTypeId;
          this.CreateFormOnEdit();
        } else {
          this.toastr.error(res.Message, "Error");
        }
      });
    } else {
    }
  }

  CreateFormOnAdd() {
    this.ZoneForm = this.formBuilder.group({
      ApplicationTypeId: ['', [Validators.required]],
      ZoneId: [0],
      DivisionCode: ['', [Validators.required]],
      DistrictCode: [''],
      TehsilCode: [''],
      ZoneName: ['', [Validators.required]],
      IsActive: [true]
    });
  }
  CreateFormOnEdit() {
    this.ZoneForm = this.formBuilder.group({
      ApplicationTypeId: [this.zone.ApplicationTypeId, [Validators.required]],
      ZoneId: [this.zone.ZoneId],
      DivisionCode: [this.zone.DivisionCode, [Validators.required]],
      DistrictCode: [this.zone.DistrictCode],
      TehsilCode: [this.zone.TehsilCode],
      ZoneName: [this.zone.ZoneName, [Validators.required]],
      IsActive: [this.zone.IsActive]
    });
  }
  save() {
    if(this.applicationTypeId.toString() == ApplicationTypeEnum.Primary)
    {
      if(!this.ZoneForm.controls['DistrictCode'].value)
      {
          let DistrictControl = this.ZoneForm.controls.DistrictCode;
          DistrictControl.setErrors({ required: true });
      }
      if(!this.ZoneForm.controls['TehsilCode'].value)
      {
          let TehsilCodeControl = this.ZoneForm.controls.TehsilCode;
          TehsilCodeControl.setErrors({ required: true });
      }
    }
    if (this.ZoneForm.valid) {
      this._categoryService.AddUpdateZone(this.ZoneForm.value).then((res) => {
        if (!res.Error) {
          this.toastr.success(res.Message, "Success");
          this.router.navigate(['/set/zonelist']);
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
    this._profileService.GetHealthFacilities().then((res) => {
      if (!res.Error) {
        this.HealthFacilities = res.List.HealthFacilities;
        this.divisionFiltered = this.HealthFacilities.filter(x => x.lvl == 'Division');
        if (this.zoneId > 0) {
          this.districtFiltered = this.HealthFacilities.filter(x => x.lvl == 'District' && x.DivisionCode == this.zone.DivisionCode);
          this.tehsilFiltered = this.HealthFacilities.filter(x => x.lvl == 'Tehsil' && x.DistrictCode == this.zone.DistrictCode);
        }
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
    if (selectedValue > 0) {
      this.districtFiltered = this.HealthFacilities.filter(x => x.lvl == 'District' && x.DivisionCode == selectedValue);
    }
  }
  GetTehsil(selectedValue) {
    this.tehsilFiltered = [];
    if (selectedValue > 0) {
      this.tehsilFiltered = this.HealthFacilities.filter(x => x.lvl == 'Tehsil' && x.DistrictCode == selectedValue);
    }
  }
  ShowHideDDL(selectedValue) {
    this.applicationTypeId = selectedValue;
  }
  //#endregion

}
