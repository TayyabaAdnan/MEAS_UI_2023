import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MonitoringService } from 'src/app/shared/services/monitoring.service';

@Component({
  selector: 'app-assignvisits',
  templateUrl: './assignvisits.component.html',
  styleUrls: ['./assignvisits.component.scss']
})
export class AssignvisitsComponent implements OnInit {
  submit: boolean = false;
  SpecialVisitForm: FormGroup;
  HealthFacilities: any;
  divisionFiltered: any;
  districtFiltered: any;
  tehsilFiltered: any;
  Zones: any;
  zonesFiltered: any;
  HealthFacilitiesFiltered: any;
  users: any;
  usersFiltered: any;
  shiftsFiltered: any;
  shifts: any;
  months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  year: number;
  date: Date;
  month: string;
  years: Array<number> = [];
  constructor(public formBuilder: FormBuilder, public loaderService: LoaderService,
    private route: ActivatedRoute, private router: Router, private _profileService: ProfileService,
    private toastr: ToastrService, private _evalService: MonitoringService) {
    this.date = new Date();
    this.year = new Date().getFullYear();
    this.month = this.months[new Date().getMonth()];
    this.GetYearList();
  }
  GetYearList() {
    var currentYear = 2021;
    while (currentYear <= this.year + 1) {
      this.years.push(currentYear);
      currentYear++;
    }
  }
  ngOnInit(): void {
    this.GetDropDownValues();
    this.CreateFormOnAdd();
  }
  CreateFormOnAdd() {
    this.SpecialVisitForm = this.formBuilder.group({
      DivisionId: ['', [Validators.required]],
      DistrictId: ['', [Validators.required]],
      TehsilId: ['', [Validators.required]],
      ZoneId: ['', [Validators.required]],
      userId: ['', [Validators.required]],
      HfId: ['', [Validators.required]],
      ShiftId: ['', [Validators.required]],
      Year: [this.year, [Validators.required]],
      Month: [this.month, [Validators.required]],
    });
  }
  save() {
    this.submit=true;
    if (this.SpecialVisitForm.valid) {
      this._evalService.GenerateSpecialVisit(this.SpecialVisitForm.value).then((res) =>{
        this.submit=false;
        if(!res.Error)
        {
          this.toastr.success(res.Message,"Success");
        }else{
          this.toastr.error(res.Message,"Error");
        }
      }).catch((error) => {
        this.submit=false;
        this.toastr.error(error.message, "Error");
      });
    }
  }
  //#region DropDown Values
  GetDropDownValues() {
    this._profileService.GetHealthFacilitiesZoneActive().then((res) => {
      if (!res.Error) {
        this.HealthFacilities = res.List.HealthFacilities;
        this.Zones = res.List.zones;
        this.shifts = res.List.hfShifts;
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
    this.zonesFiltered = [];
    this.HealthFacilitiesFiltered = [];
    this.users = [];
    this.shiftsFiltered = [];
    if (selectedValue > 0) {
      this.districtFiltered = this.HealthFacilities.filter(x => x.lvl == 'District' && x.DivisionCode == selectedValue);
    }
  }
  GetTehsil(selectedValue) {
    this.tehsilFiltered = [];
    this.zonesFiltered = [];
    this.HealthFacilitiesFiltered = [];
    this.shiftsFiltered = [];
    this.users = [];
    if (selectedValue > 0) {
      this.tehsilFiltered = this.HealthFacilities.filter(x => x.lvl == 'Tehsil' && x.DistrictCode == selectedValue);
    }
  }
  GetZones(selectedValue) {
    this.zonesFiltered = [];
    this.HealthFacilitiesFiltered = [];
    this.shiftsFiltered = [];
    this.users = [];
    if (selectedValue > 0) {
      this.zonesFiltered = this.Zones.filter(x => x.TehsilCode == selectedValue);
    }
  }
  GetUsers(selectedValue) {
    this.HealthFacilitiesFiltered = [];
    this.shiftsFiltered = [];
    this.users = [];
    if (selectedValue > 0) {
      this.HealthFacilitiesFiltered = this.HealthFacilities.filter(x => x.lvl == 'HealthFacility' && x.ZoneId == selectedValue);
      this._profileService.GetZoneUser(selectedValue).then((res) => {
        if (!res.Error) {
          this.users = res.List;
        } else {
          this.toastr.error(res.Message, "Error");
        }
      }).catch((error) => {
        this.toastr.error(error.message, "Error");
      });
    }
  }
  GetShifts(selectedValue) {
    this.shiftsFiltered = [];
    if (selectedValue != '') {
      var hfMode = this.HealthFacilities.filter(x => x.HfId == selectedValue)[0];
      if (hfMode != null) {
        this.shiftsFiltered = this.shifts.filter(x => x.HFTypeName == hfMode.ModeName);
      }
    }
  }
  //#endregion
}
