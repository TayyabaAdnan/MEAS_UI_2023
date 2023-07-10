import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../app/shared/Interceptor/token.interceptor';
import { MyLoaderInterceptor } from './shared/Interceptor/myLoader.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from "./shared/shared.module";
import { LoginComponent } from './auth/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './shared/services/user.service';
import { LowerCaseUrlSerializer } from './shared/config/LowerCaseUrlSerializer';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { UrlSerializer } from '@angular/router';
import { LoaderService } from './shared/services/loader.service';
import { PhoneMaskDirective } from './shared/directives/phone-mask.directive';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    NgSelectModule,
    HttpClientModule, 
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    ToastrModule.forRoot(),
  ],
  providers: [CookieService , UserService , LoaderService,{
    provide: UrlSerializer,
    useClass: LowerCaseUrlSerializer
},
{
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true
},
{
  provide: HTTP_INTERCEPTORS,
  useClass: MyLoaderInterceptor,
  multi: true
}
],
  bootstrap: [AppComponent]
})
export class AppModule { }
