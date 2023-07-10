import { Component, OnInit } from '@angular/core';
import { Paginatedfilterdto } from 'src/app/shared/Models/Paginationfilterdto';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MonitoringService } from 'src/app/shared/services/monitoring.service';

@Component({
  selector: 'app-visitpercentagelist',
  templateUrl: './visitpercentagelist.component.html',
  styleUrls: ['./visitpercentagelist.component.scss']
})
export class VisitpercentagelistComponent implements OnInit {

  reorderable=true;
  repeatVisitList: any=[];
  filterObj:Paginatedfilterdto = new Paginatedfilterdto();
  
  constructor(private router: Router, private _toastrService: ToastrService,private _evalService:MonitoringService,
    public loaderService:LoaderService) { }

    ngOnInit(): void {
      this._initialize();
    }
    GetRepeatVisitByPagination(){
      this._evalService.GetAllRepeatVisitPercentages(this.filterObj).then((res) => {
        if (!res.Error) {
          this.repeatVisitList = res.Data;
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
      this.GetRepeatVisitByPagination();
    }
    setPage(pageInfo) {
      this.filterObj.pageNumber = parseInt(pageInfo.offset);
      this.GetRepeatVisitByPagination();
    }
    updateFilter(event) {
      const val = event.target.value.toLowerCase();
      this.filterObj.queryString = val;
      this.filterObj.pageNumber = 0;
      this.GetRepeatVisitByPagination();
    }
    createZone() {
      this.router.navigate(['/set/repeatpercent']);
    }
    onSelect(row) {
      this.router.navigate(["/set/repeatpercent/" + row.RepeatVisitId]);
    }
    public ToggleActivationRepetVisitPercentage(row) {
      this._evalService.ToggleActiviationOfRepatVisitPercentage(row.RepeatVisitId).then((res) => {
        if (!res.Error) {
          this._toastrService.success(res.Message, "");
          this.GetRepeatVisitByPagination();
        } else {
          this._toastrService.error(res.Message, "Error");
        }
      }).catch((error) => {
        this._toastrService.error(error.message, "Error");
      });
    }

}
