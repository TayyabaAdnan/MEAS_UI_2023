import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { UserListComponent} from './user-list/user-list.component';
import { UserzoneComponent } from './userzone/userzone.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'user',
        component: UsersComponent,
      },
      {
        path: 'userlist',
        component: UserListComponent,
      },
      { 
        path: 'user/:userId', 
        component: UsersComponent,
      },
      { 
        path: 'userupload', 
        component: UserzoneComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UmsRoutingModule { }
