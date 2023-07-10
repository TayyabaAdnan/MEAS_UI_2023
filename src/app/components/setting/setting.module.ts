import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { HfzoneaddComponent } from './hfzoneadd/hfzoneadd.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZoneaddComponent } from './zone/zoneadd/zoneadd.component';
import { ZonelistComponent } from './zone/zonelist/zonelist.component';
import { HealthfacilitiesComponent } from './healthfacilities/healthfacilities.component';
import { HfActiveComponent } from './hf-active/hf-active.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { VisitpercentComponent } from './visitpercent/visitpercent.component';
import { VisitpercentagelistComponent } from './visitpercentagelist/visitpercentagelist.component';
import { AssignvisitsComponent } from './visits/assignvisits/assignvisits.component';
import { MeaUserVisitComponent } from './mea-user-visit/mea-user-visit.component';

@NgModule({
  declarations: [HfzoneaddComponent, ZoneaddComponent, ZonelistComponent, HealthfacilitiesComponent, HfActiveComponent, VisitpercentComponent, VisitpercentagelistComponent, AssignvisitsComponent, MeaUserVisitComponent],
  imports: [
    CommonModule,
    SettingRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgbModule,
    ModalModule.forRoot(),
    SharedModule,
  ]
})
export class SettingModule { }
