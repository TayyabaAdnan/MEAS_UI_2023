import { Component, OnInit } from '@angular/core';
import { Paginatedfilterdto } from 'src/app/shared/Models/Paginationfilterdto';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ToastrService } from 'ngx-toastr';
import { IndicatorService } from 'src/app/shared/services/indicator.service';

@Component({
  selector: 'app-indicatorlist',
  templateUrl: './indicatorlist.component.html',
  styleUrls: ['./indicatorlist.component.scss']
})
export class IndicatorlistComponent implements OnInit {
  eorderable=true;
  indicatorList: any=[];
  filterObj:Paginatedfilterdto = new Paginatedfilterdto();
  constructor(private router: Router, private _toastrService: ToastrService,private _indicatorService:IndicatorService,
    public loaderService:LoaderService) { }

  ngOnInit(): void {
    this._initialize();
  }
  GetIndicatorsByPagination(){
    this._indicatorService.GetIndicatorList(this.filterObj).then((res) => {
      if (!res.Error) {
        this.indicatorList = res.Data;
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
    this.GetIndicatorsByPagination();
  }
  setPage(pageInfo) {
    this.filterObj.pageNumber = parseInt(pageInfo.offset);
    this.GetIndicatorsByPagination();
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.filterObj.queryString = val;
    this.filterObj.pageNumber = 0;
    this.GetIndicatorsByPagination();
  }
  createIndicator(){
    this.router.navigate(["/indicator/add"]);
  }
 onSelect(row) {
    this.router.navigate(["/indicator/add/" + row.IndicatorId]);
  }
  public ToggleActivationIndicator(row) {
    this._indicatorService.ToggeleActivationIndicator(row.IndicatorId).then((res) => {
      if (!res.Error) {
        this._toastrService.success(res.Message, "");
        this.GetIndicatorsByPagination();
      } else {
        this._toastrService.error(res.Message, "Error");
      }
    }).catch((error) => {
      this._toastrService.error(error.message, "Error");
    });
  }
}
