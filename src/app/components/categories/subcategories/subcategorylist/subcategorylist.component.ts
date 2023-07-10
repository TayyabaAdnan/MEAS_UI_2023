import { Component, OnInit } from '@angular/core';
import { Paginatedfilterdto } from '../../../../shared/Models/Paginationfilterdto';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../../../shared/services/category.service';
import { LoaderService } from '../../../../shared/services/loader.service';

@Component({
  selector: 'app-subcategorylist',
  templateUrl: './subcategorylist.component.html',
  styleUrls: ['./subcategorylist.component.scss']
})
export class SubcategorylistComponent implements OnInit {
  reorderable=true;
  subcategorylist: any=[];
  filterObj:Paginatedfilterdto = new Paginatedfilterdto();
  constructor(private router: Router, private _toastrService: ToastrService,private _categoryService:CategoryService,
    public loaderService:LoaderService) { }

    ngOnInit(): void {
      this._initialize();
    }
    GetSubCategoriesByPagination(){
      this._categoryService.GetSubCategoriesPaginated(this.filterObj).then((res) => {
        if (!res.Error) {
          this.subcategorylist = res.Data;
          this.filterObj.totalRecords = res.TotalRecords;
          this.filterObj.size = res.Size;
          this.filterObj.pageCount=res.PageCount;
          this.filterObj.pageNumber=res.PageNumber;
        } else {
          this._toastrService.error(res.Message, "Error");
        }
      }).catch((error) => {
        this._toastrService.error(error.message, "Error");
      });
    }
    _initialize(): void {
      this.GetSubCategoriesByPagination();
    }
    setPage(pageInfo) {
      this.filterObj.pageNumber = parseInt(pageInfo.offset);
      this.GetSubCategoriesByPagination();
    }
    updateFilter(event) {
      const val = event.target.value.toLowerCase();
      this.filterObj.queryString = val;
      this.filterObj.pageNumber = 0;
      this.GetSubCategoriesByPagination();
    }
    createSubCategory() {
      this.router.navigate(['/setting/subcategory']);
    }
    onSelect(row) {
      this.router.navigate(["/setting/subcategory/" + row.SubCategoryId]);
    }
    public ToggleActivationSubCategory(row) {
      this._categoryService.ActivationSubCategory(row.SubCategoryId).then((res) => {
        if (!res.Error) {
          this._toastrService.success(res.Message, "");
          this.GetSubCategoriesByPagination();
        } else {
          this._toastrService.error(res.Message, "Error");
        }
      }).catch((error) => {
        this._toastrService.error(error.message, "Error");
      });
    }

}
