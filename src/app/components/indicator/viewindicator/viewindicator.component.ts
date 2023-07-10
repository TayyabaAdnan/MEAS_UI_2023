import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { IndicatorService } from 'src/app/shared/services/indicator.service';

@Component({
  selector: 'app-viewindicator',
  templateUrl: './viewindicator.component.html',
  styleUrls: ['./viewindicator.component.scss']
})
export class ViewindicatorComponent implements OnInit {
  submit:boolean=false;
  indicatorForm: FormGroup;
  HFTypeList:any;
  HFTypeFilteredList:any;
  Shifts:any;
  Modules:any;
  ApplicationTypes:any;
  HealthFacilities:any;
  ModulesSelected:any;
  HfFiltered:any;
  shiftsFiltered:any;
  indicators:any;

  constructor(public formBuilder: FormBuilder, public loaderService: LoaderService,
     private toastr: ToastrService,
     private route: ActivatedRoute, private router: Router,
     private _profileService:ProfileService,
     private _indicatorService:IndicatorService) { }

  ngOnInit(): void {
    this.GetAllDropDowns();
    this.CreateFormOnAdd();
  }
  CreateFormOnAdd() {
    this.indicatorForm = this.formBuilder.group({
      ApplicationType: ['', [Validators.required]],
      ModuleId: ['', [Validators.required]],
      ShiftId: ['',[Validators.required]],
      HfTypeId: ['', [Validators.required]],
      HfId: [''],
      FormId: ['']
    });
  }
  GetAllDropDowns() {
    this._profileService.GetIndicatorDropDownData().then((res) => {
      if (!res.Error) {
        this.HFTypeList = res.List.hf;
        this.Shifts = res.List.HFShifts;
        this.Modules = res.List.modules;
        this.ApplicationTypes = res.List.applicatioTypes;
        this.HealthFacilities = res.List.healthFacilities;
      } else {
        this.toastr.error(res.Message, "Error");
      }
    }).catch((error) => {
      this.toastr.error(error.message, "Error");
    });
  }
  GetHealthFacilities(selectedValue)
  {
    this.HfFiltered=[];
    this.shiftsFiltered=[];
    if(selectedValue > 0)
    {
      var hfTypeName = this.HFTypeList.filter(x => x.FacilityTypeId == selectedValue).map(function (a) { return a.FaciltyTypeName }) as Array<any>;
      this.HfFiltered = this.HealthFacilities.filter(x => hfTypeName.includes(x.HfType));
      this.shiftsFiltered = this.Shifts.filter(x => x.HFTypeId == selectedValue);
    }
  }
  GetModules(selectedValue)
  {
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
  Search(){
    this.submit=true;
    if(this.indicatorForm.valid)
    {
      this.submit=false;
      this._indicatorService.GetIndicators(this.indicatorForm.value).then((res) => {
        if (!res.Error) {
          debugger;
          this.indicators = res.List;
        } else {
          this.toastr.error(res.Message, "Error");
        }
      }).catch((error) => {
        this.toastr.error(error.message, "Error");
      });
    }
  }
}
