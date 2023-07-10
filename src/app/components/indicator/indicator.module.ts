import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndicatorRoutingModule } from './indicator-routing.module';
import { IndicatormasterComponent } from './indicatormaster/indicatormaster.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { IndicatorlistComponent } from './indicatorlist/indicatorlist.component';
import { ViewindicatorComponent } from './viewindicator/viewindicator.component';
import { IndicatornewComponent } from './indicatornew/indicatornew.component';
import { IndicatorPhysicalViewComponent } from './indicator-physical-view/indicator-physical-view.component';


@NgModule({
  declarations: [IndicatormasterComponent, IndicatorlistComponent, ViewindicatorComponent, IndicatornewComponent, IndicatorPhysicalViewComponent],
  imports: [
    CommonModule,
    IndicatorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgSelectModule,
    SharedModule
  ]
})
export class IndicatorModule { }
