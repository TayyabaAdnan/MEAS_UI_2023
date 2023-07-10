import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategorymasterComponent } from './categorymaster/categorymaster.component';
import { CategorylistComponent } from './categorylist/categorylist.component';
import { SubcategorylistComponent } from '../categories/subcategories/subcategorylist/subcategorylist.component';
import { SubcategoryComponent } from '../categories/subcategories/subcategory/subcategory.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'category',
        component: CategorymasterComponent,
      },
      { 
        path: 'category/:categoryId', 
        component: CategorymasterComponent,
      },
      { 
        path: 'categorylist', 
        component: CategorylistComponent,
      },
      { 
        path: 'subcategorylist', 
        component:SubcategorylistComponent ,
      },
      { 
        path: 'subcategory', 
        component: SubcategoryComponent,
      },
      { 
        path: 'subcategory/:subCategoryId', 
        component: SubcategoryComponent,
      },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
