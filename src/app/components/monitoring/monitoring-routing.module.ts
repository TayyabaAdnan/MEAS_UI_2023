import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonitoringlistComponent } from './monitoringlist/monitoringlist.component';
import { MonitoringdetailComponent} from './monitoringdetail/monitoringdetail.component';
import { from } from 'rxjs';
import { BemOncComponent } from './bem-onc/bem-onc.component';
import { MonitoringlistnewComponent } from './monitoringlistnew/monitoringlistnew.component';
import { MonitoringdetailnewComponent} from './monitoringdetailnew/monitoringdetailnew.component';

import { BedsSurveyComponent } from './beds-survey/beds-survey.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: MonitoringlistComponent,
      },
      {
        path: 'list-new',
        component: MonitoringlistnewComponent,
      },
      {
        path: 'hfblist',
        component: BedsSurveyComponent,
      }, 
      {
        path: 'list-new/:type/:hftype/:status',
        component: MonitoringlistnewComponent,
      },
      {
        path: 'detail/:MonitoringMasterId',
        component: MonitoringdetailComponent,
      },
      {
        path: 'detail-new/:MonitoringMasterId',
        component: MonitoringdetailnewComponent,
      },
      {
        path: 'bemonc',
        component: BemOncComponent,
      },
      
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoringRoutingModule { }
