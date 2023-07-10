import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitoringRoutingModule } from './monitoring-routing.module';
import { MonitoringlistComponent } from './monitoringlist/monitoringlist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MonitoringdetailComponent } from './monitoringdetail/monitoringdetail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BemOncComponent } from './bem-onc/bem-onc.component';
import { MonitoringlistnewComponent } from './monitoringlistnew/monitoringlistnew.component';
import { MonitoringlistnewdetailsComponent } from './monitoringlistnewdetails/monitoringlistnewdetails.component';
import { MonitoringdetailnewComponent } from './monitoringdetailnew/monitoringdetailnew.component';
import { BedsSurveyComponent } from './beds-survey/beds-survey.component';


@NgModule({
  declarations: [MonitoringlistComponent, MonitoringdetailComponent, BemOncComponent, MonitoringlistnewComponent, MonitoringlistnewdetailsComponent, MonitoringdetailnewComponent, BedsSurveyComponent],
  imports: [
    CommonModule,
    MonitoringRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    SharedModule,
    NgSelectModule,
    NgbModule
  ]
})
export class MonitoringModule { }
