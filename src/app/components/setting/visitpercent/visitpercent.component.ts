import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MonitoringService } from 'src/app/shared/services/monitoring.service';

@Component({
  selector: 'app-visitpercent',
  templateUrl: './visitpercent.component.html',
  styleUrls: ['./visitpercent.component.scss']
})
export class VisitpercentComponent implements OnInit {
  RepeatVisitMode: string = "Add Repeat Visit %";
  submit: boolean;
  RepeatVisitForm: FormGroup;
  date: Date;
  years: Array<number> = [];
  year: number;
  repeatVisitId: number = 0;
  repeatVisit: any;
  months = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
  month:string;
  constructor(public formBuilder: FormBuilder, public loaderService: LoaderService,
    private route: ActivatedRoute, private router: Router,
    private toastr: ToastrService,
    public _monitoringService: MonitoringService) {
    this.date = new Date();
    this.year = new Date().getFullYear();
    this.month = this.months[new Date().getMonth()];
    this.GetYearList();

  }
  GetYearList() {
    var currentYear = 2021;
    while (currentYear <= this.year + 1) {
      this.years.push(currentYear);
      currentYear++;
    }
  }
  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('percentageId');
    this.submit = false;
    this.CreateFormOnAdd();
    if (id) {
      this.RepeatVisitMode = "Update Repeat Visit %";
      this.repeatVisitId = parseInt(id);
      this._monitoringService.GetRepeatVisitPercet(Number(this.repeatVisitId)).then(res => {
        if (!res.Error) {
          this.repeatVisit = res.Data;
          this.CreateFormOnEdit();
        } else {
          this.toastr.error(res.Message, "Error");
        }
      });
    } else {
    }
  }
  CreateFormOnAdd() {
    this.RepeatVisitForm = this.formBuilder.group({
      RepeatVisitId: [0],
      RepeatVisitPercent: ['', [Validators.required]],
      Month: [this.month, [Validators.required]],
      Year: [this.year , [Validators.required]],
      IsActive: [true]
    });
  }
  CreateFormOnEdit() {
    this.RepeatVisitForm = this.formBuilder.group({
      RepeatVisitId: [this.repeatVisit.RepeatVisitId, [Validators.required]],
      RepeatVisitPercent: [this.repeatVisit.RepeatVisitPercent, [Validators.required]],
      Month: [this.repeatVisit.Month, [Validators.required]],
      Year: [this.repeatVisit.Year, [Validators.required]],
      IsActive: [this.repeatVisit.IsActive]
    });
  }

  save() {
    this.submit=true;
    if (this.RepeatVisitForm.valid) {
      this._monitoringService.AddUpdateRepatVisit(this.RepeatVisitForm.value).then(res => {
        if (!res.Error) {
          this.toastr.success(res.Message, "Success");
          this.router.navigate(['/set/repeatpercentlist']);
        } else {
          this.submit=false;
          this.toastr.error(res.Message, "Error");
        }
      });
    }
    else{
      this.submit=false;
    }
  }
  public chekcValidPercent(event) {
    debugger;
    if (event.target.value < 0 || event.target.value > 100) {
      this.toastr.error("Enter Valid %", "Error");
      let RepeatVisitPercentControl = this.RepeatVisitForm.controls.RepeatVisitPercent;
      RepeatVisitPercentControl.setErrors({ required: true });
    }
  }
}
