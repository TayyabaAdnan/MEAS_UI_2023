import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZoneaddComponent } from './zone/zoneadd/zoneadd.component';
import { ZonelistComponent } from './zone/zonelist/zonelist.component';
import { HfzoneaddComponent } from './hfzoneadd/hfzoneadd.component';
import { HealthfacilitiesComponent } from './healthfacilities/healthfacilities.component';
import { VisitpercentagelistComponent } from './visitpercentagelist/visitpercentagelist.component';
import { VisitpercentComponent } from './visitpercent/visitpercent.component';
import { AssignvisitsComponent } from './visits/assignvisits/assignvisits.component';
import { MeaUserVisitComponent } from './mea-user-visit/mea-user-visit.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'add',
        component: ZoneaddComponent,
      },
      { 
        path: 'add/:zoneId', 
        component: ZoneaddComponent,
      },
      { 
        path: 'zonelist', 
        component: ZonelistComponent,
      },
      {
        path: 'zonehf',
        component: HfzoneaddComponent,
      },
      {
        path: 'activehf',
        component: HealthfacilitiesComponent,
      },
      {
        path: 'repeatpercentlist',
        component: VisitpercentagelistComponent,
      },
      {
        path: 'repeatpercent',
        component: VisitpercentComponent,
      },
      {
        path: 'repeatpercent/:percentageId',
        component: VisitpercentComponent,
      },
      {
        path: 'specialvisits',
        component: AssignvisitsComponent,
      },
      {
        path: 'measvisits',
        component: MeaUserVisitComponent,
      },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
