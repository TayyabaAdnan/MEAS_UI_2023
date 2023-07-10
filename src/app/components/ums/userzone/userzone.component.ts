import { Component, OnInit } from '@angular/core';
import { LoaderService} from '../../../shared/services/loader.service';
import * as XLSX from 'xlsx';
import { UserFileUpload} from '../../../shared/Models/DTO/userfiledto';
import {UmsService} from '../../../shared/services/ums.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-userzone',
  templateUrl: './userzone.component.html',
  styleUrls: ['./userzone.component.scss']
})
export class UserzoneComponent implements OnInit {

  file:File;
  users:Array<UserFileUpload>=[];
  constructor(public loaderService:LoaderService,private _umsService:UmsService,private toastr:ToastrService) { }

  ngOnInit(): void {
  }
  
incomingfile(event) 
  {
  this.file= event.target.files[0]; 
  }
  Upload(){
    debugger;
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(this.file);
    reader.onload = (e: any) => {
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      debugger;
      this._umsService.UpdateeUserZoneId(data).then((res) => {
        if (!res.Error) {
          this.file=null;
          this.toastr.success(res.Message, "Success");
        } else {
          this.toastr.error(res.Message, "Error");
        }
      }).catch((error) => {
        this.toastr.error(error.message, "Error");
      });
    };
  }
}
