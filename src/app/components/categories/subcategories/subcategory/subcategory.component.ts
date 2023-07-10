import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoaderService } from '../../../../shared/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../../../shared/services/profile.service';
import { CategoryService } from '../../../../shared/services/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent implements OnInit {
  submit: boolean;
  subCategoryForm: FormGroup;
  categoryList: any;
  SubCategoryMode: string = "Add Sub Category"

  constructor(public formBuilder: FormBuilder, public loaderService: LoaderService,
    private route: ActivatedRoute, private router: Router,
    private toastr: ToastrService,private _categoryService:CategoryService) { }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('subCategoryId');
    this.submit = false;
    this.GetCategories();
    this.CreateFormOnAdd();
    if (id) {
      this.SubCategoryMode = 'Edit Category';
    }
  }

  CreateFormOnAdd() {
    this.subCategoryForm = this.formBuilder.group({
      SubCategoryId: [0],
      SubCategoryName: ['', [Validators.required]],
      CategoryId: ['', [Validators.required]],
      IsActive: [true]
    });
  }
  save() {
    if (this.subCategoryForm.valid) {
      this._categoryService.AddUpdateSubCategory(this.subCategoryForm.value).then((res) => {
        if (!res.Error) {
          this.toastr.success(res.Message, "Success");
          this.router.navigate(['/setting/subcategorylist']);
        } else {
          this.toastr.error(res.Message, "Error");
        }
      }).catch((error) => {
        this.toastr.error(error.message, "Error");
      });
    }
  }

  //#region DropDown Functions
  GetCategories() {
    this._categoryService.GetCategories().then((res) => {
      if (!res.Error) {
        this.categoryList = res.List;
      } else {
        this.toastr.error(res.Message, "Error");
      }
    }).catch((error) => {
      this.toastr.error(error.message, "Error");
    });
  }
  //#endregion

}
