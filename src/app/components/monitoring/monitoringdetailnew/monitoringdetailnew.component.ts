import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from "@angular/router";
import { MonitoringService } from '../../../shared/services/monitoring.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-monitoringdetailnew',
  templateUrl: './monitoringdetailnew.component.html',
  styleUrls: ['./monitoringdetailnew.component.scss']
})
export class MonitoringdetailnewComponent implements OnInit {
  MonitoringMasterId: number = 0;
  MonitoringDetail: any;
  changeIndicators: any=[];
  userId=0;
  @ViewChild('pdfTable') pdfTable: ElementRef;

  constructor(private toastr: ToastrService, private route: ActivatedRoute,
    private _monitoringService: MonitoringService, public loaderService: LoaderService,
    public sanitizer: DomSanitizer,private _loginService:AuthService) {
      var user= this._loginService.currentUser();
      if(user)
      {
        this.userId = user.UserId;
      }

  }

  ngOnInit(): void {
    this.MonitoringMasterId = Number(this.route.snapshot.paramMap.get('MonitoringMasterId'));
    this.initialize();
  }
  initialize() {
    debugger;
    this._monitoringService.GetMonitoringDetailNew(this.MonitoringMasterId).then((res) => {
      debugger;
    console.log(res.Data);
      if (!res.Error) {
        this.MonitoringDetail = res.Data;
      }
      else {
        this.toastr.error(res.Message, "Error");
      }
    }).catch((error) => {
      this.toastr.error(error.Message, "Error");
    });
  }
  sanitizeImageUrl(imageUrl: string): SafeUrl {
    let splitedValue = imageUrl.split('.');
    if (splitedValue.length > 1) {
      return this.sanitizer.bypassSecurityTrustUrl(this._monitoringService.APIUrl + 'Uploads/' + imageUrl);
    }
    else {
      return this.sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + imageUrl);
    }
  }
  //#region Export
  downloadAsPDF() {
    const doc = new jsPDF();

    const pdfTable = this.pdfTable.nativeElement;

    var html = htmlToPdfmake(pdfTable.innerHTML);

    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).open();
  }
  //#endregion

  //#region Save
  ChangeIndicatorAnswer(event, indicatorId) {
    var value = event.target.value;
    let changeIndi = this.changeIndicators.filter(x => x.indicatorId == indicatorId);
    if (changeIndi.length > 0) {
      let index = this.changeIndicators.findIndex(x => x.indicatorId == indicatorId)
      if(index >= 0)
      {
        this.changeIndicators[index].changeValue = value;
      }
    }
    else {
      this.changeIndicators.push({
        changeValue: value,
        indicatorId: indicatorId
      });
    }
  }
  SaveIndicatorAnswer(indicatorId)
  {
    let changeIndi = this.changeIndicators.filter(x => x.indicatorId == indicatorId);
    if(changeIndi.length > 0)
    {
      let obj = {
        changeValue: changeIndi[0].changeValue,
        indicatorId: indicatorId,
        MonitoringId:this.MonitoringMasterId
      }
      this._monitoringService.ChangeAnswer(obj).then((res) => {
        if (!res.Error) {
          this.initialize();
          this.toastr.success(res.Message, "Success");
        }
        else {
          this.toastr.error(res.Message, "Error");
        }
      }).catch((error) => {
        this.toastr.error(error.Message, "Error");
      });
    }else{
      this.toastr.error("Enter Change Value First","Error");
    }
  }
  //#endregion

}
