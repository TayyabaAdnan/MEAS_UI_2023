import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/shared/services/category.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Paginatedfilterdto } from 'src/app/shared/Models/Paginationfilterdto';
import { MonitoringService } from 'src/app/shared/services/monitoring.service';
import * as XLSX from 'xlsx';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-zonelist',
  templateUrl: './zonelist.component.html',
  styleUrls: ['./zonelist.component.scss']
})
export class ZonelistComponent implements OnInit {
  reorderable=true;
  zoneList: any=[];
  filterObj:Paginatedfilterdto = new Paginatedfilterdto();
  usersVisits: any;
  user: any;

  constructor(private router: Router, private _toastrService: ToastrService,
    private _categoryService:CategoryService,
    public loaderService:LoaderService,
    public _monitoringService: MonitoringService,
    public _loginService:AuthService) {
      this.user = this._loginService.currentUser();
     }

  ngOnInit(): void {
    this._initialize();
  }
  GetZonesByPagination(){
    this._categoryService.GetZonePaginated(this.filterObj).then((res) => {
      if (!res.Error) {
        this.zoneList = res.Data;
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
    this.GetZonesByPagination();
  }
  setPage(pageInfo) {
    this.filterObj.pageNumber = parseInt(pageInfo.offset);
    this.GetZonesByPagination();
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.filterObj.queryString = val;
    this.filterObj.pageNumber = 0;
    this.GetZonesByPagination();
  }
  createZone() {
    this.router.navigate(['/set/add']);
  }
  onSelect(row) {
    this.router.navigate(["/set/add/" + row.ZoneId]);
  }
  public ToggleActivationZone(row) {
    this._categoryService.ActivationZone(row.ZoneId).then((res) => {
      if (!res.Error) {
        this._toastrService.success(res.Message, "");
        this.GetZonesByPagination();
      } else {
        this._toastrService.error(res.Message, "Error");
      }
    }).catch((error) => {
      this._toastrService.error(error.message, "Error");
    });
  }
  GetCurrentMonthVisits() {
    this._monitoringService.GetUsersVists().then((res) => {
      if (!res.Error) {
        this.usersVisits = res.List;
        setTimeout(() => {
          this.ExportExcel();
        }, 3000);
      }
    });
  }

  public ExportExcel(): void {
    let element = document.getElementById("tblUserVisits");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    let fileName = "Users Visits.xlsx"
    if (this.usersVisits.length > 0) {
      fileName = this.usersVisits[0].CurrentMonth +"_" + this.usersVisits[0].CurentYear + "_Users Visits.xlsx";
    }
    XLSX.writeFile(wb, fileName);
  }
}
