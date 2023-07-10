import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategorymasterComponent } from './categorymaster/categorymaster.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CategorylistComponent } from './categorylist/categorylist.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SubcategoryComponent } from './subcategories/subcategory/subcategory.component';
import { SubcategorylistComponent } from './subcategories/subcategorylist/subcategorylist.component';


@NgModule({
  declarations: [CategorymasterComponent, CategorylistComponent, SubcategoryComponent, SubcategorylistComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    NgSelectModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ]
})
export class CategoriesModule { }
