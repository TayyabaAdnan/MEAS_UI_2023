import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoaderService } from '../../../shared/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../../shared/services/profile.service';
import { CategoryService } from '../../../shared/services/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categorymaster',
  templateUrl: './categorymaster.component.html',
  styleUrls: ['./categorymaster.component.scss']
})
export class CategorymasterComponent implements OnInit {
  submit: boolean;
  categoryForm: FormGroup;
  ApplicationTypes: any;
  Modules: any;
  filteredModules: any = [];
  Shifts: any;
  HFTypes: any;
  HFTypesFilter: any;
  CategoryMode: string = "Add Category";
  categoryId: number;
  category: any;
  constructor(public formBuilder: FormBuilder, public loaderService: LoaderService,
    private route: ActivatedRoute, private router: Router, private _profileService: ProfileService,
    private toastr: ToastrService, private _categoryService: CategoryService) { }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('categoryId');
    this.submit = false;
    this.GetDropDownValues();
    this.CreateFormOnAdd();
    if (id) {
      this.categoryId = parseInt(id);
      this.CategoryMode = 'Edit Category';
      this._categoryService.GetCategoryById(this.categoryId).then(res => {
        if (!res.Error) {
            this.category = res.Data;
            this.GetModules(this.category.ModuleId);
            this.CreateFormOnUpdate();
          
        } else {
          this.toastr.error(res.Message, "Error");
        }
      });
    } else {
    }
  }
  CreateFormOnAdd() {
    this.categoryForm = this.formBuilder.group({
      CategoryId: [0],
      CategoryName: ['', [Validators.required]],
      HfTypes: ['', [Validators.required]],
      Shifts: ['', [Validators.required]],
      ModuleId: ['', [Validators.required]],
      ApplicationTypeId: ['', Validators.required],
      SequenceNo: ['', Validators.required],
      isActive: [true]
    });
  }
  CreateFormOnUpdate() {
    this.categoryForm = this.formBuilder.group({
      CategoryId: [this.category.CategoryId],
      CategoryName: [this.category.CategoryName, [Validators.required]],
      HfTypes: [this.category.HfTypes, [Validators.required]],
      Shifts: [this.category.Shifts, [Validators.required]],
      ModuleId: [this.category.ModuleId, [Validators.required]],
      ApplicationTypeId: [this.category.ApplicationTypeId, Validators.required],
      SequenceNo: [this.category.SequenceNo, Validators.required],
      isActive: [this.category.isActive]
    });
  }
  save() {
    if (this.categoryForm.valid) {
      this._categoryService.AddUpdateCategory(this.categoryForm.value).then((res) => {
        if (!res.Error) {
          this.toastr.success(res.Message, "Success");
          this.router.navigate(['/setting/categorylist']);
        } else {
          this.toastr.error(res.Message, "Error");
        }
      }).catch((error) => {
        this.toastr.error(error.message, "Error");
      });
    }
  }

  //#region DropDown Functions
  GetDropDownValues() {
    this._profileService.GetAllDropDownData().then((res) => {
      if (!res.Error) {
        this.HFTypes = res.List.HealthFacilityType;
        this.Modules = res.List.Modules;
        this.Shifts = res.List.Shifts;
        this.ApplicationTypes = res.List.ApplicationType;

      } else {
        this.toastr.error(res.Message, "Error");
      }
    }).catch((error) => {
      this.toastr.error(error.message, "Error");
    });
  }
  GetModules(selectedValue) {
    this.filteredModules = [];
    this.HFTypesFilter = [];
    if (selectedValue > 0) {
      var hftyPes = this.ApplicationTypes.filter(x => x.ApplicationTypeId == selectedValue).map(a => a.HfTypeIds);
      let hType = hftyPes[0];
      this.HFTypesFilter = this.HFTypes.filter(x => hType.includes(x.FacilityTypeId));
      this.filteredModules = this.Modules.filter(x => x.ApplicationTypeId == selectedValue);
    }
  }
  //#endregion
}
