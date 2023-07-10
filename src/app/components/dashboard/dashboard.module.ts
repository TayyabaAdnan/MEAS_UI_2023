import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainComponent } from './main/main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IndicatorDetailComponent } from './indicator-detail/indicator-detail.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CountsComponent } from './counts/counts.component';

@NgModule({
  declarations: [MainComponent, IndicatorDetailComponent, CountsComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    HighchartsChartModule,
    NgxDatatableModule,
    NgbModule
  ]
})
export class DashboardModule { }
