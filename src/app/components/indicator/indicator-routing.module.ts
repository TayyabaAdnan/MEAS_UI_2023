import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndicatormasterComponent } from './indicatormaster/indicatormaster.component';
import { IndicatorlistComponent } from './indicatorlist/indicatorlist.component';
import { ViewindicatorComponent } from './viewindicator/viewindicator.component';
import { IndicatornewComponent } from './indicatornew/indicatornew.component';
import {IndicatorPhysicalViewComponent } from './indicator-physical-view/indicator-physical-view.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'update',
        component: IndicatormasterComponent,
      },
      {
        path: 'add',
        component: IndicatornewComponent,
      },
      { 
        path: 'add/:indicatorId', 
        component: IndicatormasterComponent,
      },
      { 
        path: '', 
        component: IndicatorlistComponent,
      },
      { 
        path: 'viewindicators', 
        component: ViewindicatorComponent,
      },
      { 
        path: 'physicalview', 
        component: IndicatorPhysicalViewComponent,
      },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndicatorRoutingModule { }
