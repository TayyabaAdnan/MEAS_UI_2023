import { Component, OnInit } from '@angular/core';
import { Paginatedfilterdto } from '../../../shared/Models/Paginationfilterdto';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/shared/services/category.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-categorylist',
  templateUrl: './categorylist.component.html',
  styleUrls: ['./categorylist.component.scss']
})
export class CategorylistComponent implements OnInit {
  reorderable=true;
  categorylist: any=[];
  filterObj:Paginatedfilterdto = new Paginatedfilterdto();

  constructor(private router: Router, private _toastrService: ToastrService,private _categoryService:CategoryService,
    public loaderService:LoaderService) { }

  ngOnInit(): void {
    this._initialize();
  }
  GetCategoriesByPagination(){
    this._categoryService.GetCategoriesPaginated(this.filterObj).then((res) => {
      if (!res.Error) {
        this.categorylist = res.Data;
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
    this.GetCategoriesByPagination();
  }
  setPage(pageInfo) {
    this.filterObj.pageNumber = parseInt(pageInfo.offset);
    this.GetCategoriesByPagination();
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.filterObj.queryString = val;
    this.filterObj.pageNumber = 0;
    this.GetCategoriesByPagination();
  }
  createCategory() {
    this.router.navigate(['/setting/category']);
  }
  onSelect(row) {
    this.router.navigate(["/setting/category/" + row.CategoryId]);
  }
  public ToggleActivationCategory(row) {
    this._categoryService.ActivationCategory(row.CategoryId).then((res) => {
      if (!res.Error) {
        this._toastrService.success(res.Message, "");
        this.GetCategoriesByPagination();
      } else {
        this._toastrService.error(res.Message, "Error");
      }
    }).catch((error) => {
      this._toastrService.error(error.message, "Error");
    });
  }
}
