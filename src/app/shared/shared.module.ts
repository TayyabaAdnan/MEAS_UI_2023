import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ContentLayoutComponent } from './components/layout/content-layout/content-layout.component';
import { FeatherIconsComponent } from './components/feather-icons/feather-icons.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

// services
import { NavService } from "./services/nav.service";

// Directives
import { ToggleFullscreenDirective } from "./directives/fullscreen.directive";
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { LoaderDirective } from './directives/loader.directive';
import { PhoneMaskDirective } from './directives/phone-mask.directive';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ContentLayoutComponent,
    FeatherIconsComponent,
    BreadcrumbComponent,
    ToggleFullscreenDirective,
    LoaderDirective,
    PhoneMaskDirective
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AutocompleteLibModule
  ],
  exports: [
    FeatherIconsComponent,
    LoaderDirective,
    PhoneMaskDirective
  ],
  providers: [
    NavService
  ]
})
export class SharedModule { }

