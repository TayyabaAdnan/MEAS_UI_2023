import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../shared/services/profile.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { IndicatorService } from '../../../shared/services/indicator.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
@Component({
  selector: 'app-indicator-physical-view',
  templateUrl: './indicator-physical-view.component.html',
  styleUrls: ['./indicator-physical-view.component.scss']
})
export class IndicatorPhysicalViewComponent implements OnInit {
  submit: boolean = false;
  Categories: any;
  Modules: any;
  HFShifts: any;
  ShiftsFiltered: any;
  ApplicationTypes: any;
  HealthFacilityType: any;
  HealthFacilityTypeFiltered: any;
  ModulesSelected: any;
  CategoriesSelected: any;
  indicatorForm: FormGroup;
  indicatorList: any = [];
  constructor(public _profileService: ProfileService, private toastr: ToastrService,
    private route: ActivatedRoute, private router: Router, public formBuilder: FormBuilder,
    public _indicatorService: IndicatorService, public loaderService: LoaderService) { }

  ngOnInit(): void {
    this.GetAllDropDowns();
    this.indicatorForm = this.formBuilder.group({
      ApplicationType: ['', [Validators.required]],
      ModuleId: ['', [Validators.required]],
      CategoryId: ['', [Validators.required]],
      ShiftId: ['', Validators.required],
      HfTypeId: ['', Validators.required]
    })
  }
  GetAllDropDowns() {
    this._profileService.GetIndicatorDropDownData().then((res) => {
      if (!res.Error) {

        this.Categories = res.List.categories;
        this.Modules = res.List.modules;
        this.ApplicationTypes = res.List.applicatioTypes;
        this.HFShifts = res.List.HFShifts;
        this.HealthFacilityType = res.List.HealthFacilityType;

      } else {
        this.toastr.error(res.Message, "Error");
      }
    }).catch((error) => {
      this.toastr.error(error.message, "Error");
    });
  }
  GetModules(selectedValue) {
    this.CategoriesSelected = [];
    this.ModulesSelected = [];
    if (selectedValue > 0) {
      this.ModulesSelected = this.Modules.filter(x => x.ApplicationTypeId == selectedValue);
    }
  }
  GetCategories(selectedValue) {
    this.CategoriesSelected = [];
    if (selectedValue > 0) {
      this.CategoriesSelected = this.Categories.filter(x => x.ModuleId == selectedValue && (x.CategoryName.toLowerCase().includes("medicine") || x.CategoryName.toLowerCase().includes("equipment")));
    }
  }
  GetHFTypes(selectedValue)
  {
    this.HealthFacilityTypeFiltered=[];
    this.ShiftsFiltered=[];
    if(selectedValue > 0)
    {
      this.HealthFacilityTypeFiltered = this.HealthFacilityType.filter(z => z.CategoryId == selectedValue);
    }
  }
  GetShifts(selectedValue) {
    this.ShiftsFiltered = [];
    if (selectedValue > 0) {
      this.ShiftsFiltered = this.HFShifts.filter(x => x.HFTypeId == selectedValue);
    }
  }
  search() {
    this.submit = true;
    if (this.indicatorForm.valid) {
      this._indicatorService.SearchIndicator(this.indicatorForm.value).then((res) => {
        if (!res.Error) {
          this.submit = false;
          this.indicatorList = res.List;
        } else {
          this.submit = false;
          this.toastr.error(res.Message, "Error");
        }
      }).catch((error) => {
        this.submit = false;
        this.toastr.error(error.message, "Error");
      });
    }
  }
  UpdatePhysicalView(indicatorId) {
    let index = this.indicatorList.findIndex(item => item.IndicatorId == indicatorId);
    this.indicatorList[index].IsPhysicalView = !this.indicatorList[index].IsPhysicalView;
  }
  save() {
    if (this.indicatorForm.valid) {
      this._indicatorService.SavePhysicalViewIndicator(this.indicatorList).then((res) => {
        if (!res.Error) {
          this.toastr.success(res.Message, "Success");
        } else {
          this.toastr.error(res.Message, "Error");
        }
      }).catch((error) => {
        this.toastr.error(error.message, "Error");
      });
    }
  }
}
