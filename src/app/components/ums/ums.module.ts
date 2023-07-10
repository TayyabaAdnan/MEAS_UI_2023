import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { UmsRoutingModule } from './ums-routing.module';
import { UsersComponent } from './users/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserListComponent } from './user-list/user-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserzoneComponent } from './userzone/userzone.component';
//import { PhoneMaskDirective } from 'src/app/shared/directives/phone-mask.directive';

@NgModule({
  declarations: [UsersComponent, UserListComponent, UserzoneComponent],
  imports: [
    NgSelectModule,
    CommonModule,
    UmsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    SharedModule,
  ],
  providers: [
    ToastrService
  ]
})
export class UmsModule { }
