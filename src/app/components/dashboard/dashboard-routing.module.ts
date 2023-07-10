import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent} from './main/main.component';
import { IndicatorDetailComponent } from './indicator-detail/indicator-detail.component';
import { CountsComponent } from './counts/counts.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'indicatordetail',
        component: IndicatorDetailComponent,
      },
      {
        path: 'counts',
        component: CountsComponent,
      },
      {
        path: '',
        component: MainComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
