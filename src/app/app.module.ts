
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

//Angular Material Imports
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDialogModule} from '@angular/material/dialog';
import { MatSlideToggleModule,_MatSlideToggleRequiredValidatorModule,} from '@angular/material/slide-toggle';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
import {MatPaginatorModule} from '@angular/material/paginator';
import {NgFor, NgIf} from '@angular/common';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {MatTableModule} from '@angular/material/table';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoadingComponent } from './components/loading/loading.component';
import { HomeComponent } from './pages/home/home.component';
import { SidebarContentComponent } from './components/sidebar-content/sidebar-content.component';

import { LoginSelectComponent } from './pages/login-select/login-select.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SuleatSettingsComponent } from './pages/suleat-settings/suleat-settings.component';
import { ErrorpageComponent } from './components/errorpage/errorpage.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { ViewUserComponent } from './pages/view-user/view-user.component';
import { NewUserInputComponent } from './pages/new-user-input/new-user-input.component';
import { FelicitySalesadminComponent } from './pages/felicity-salesadmin/felicity-salesadmin.component';
import { FelicityProductionadminComponent } from './pages/felicity-productionadmin/felicity-productionadmin.component';
import { FelicityDeliveryadminComponent } from './pages/felicity-deliveryadmin/felicity-deliveryadmin.component';
import { FelicityOrderanalyticsComponent } from './pages/felicity-orderanalytics/felicity-orderanalytics.component';
import { SuleatSalesadminComponent } from './pages/suleat-salesadmin/suleat-salesadmin.component';
import { SuleatProductionadminComponent } from './pages/suleat-productionadmin/suleat-productionadmin.component';
import { SuleatDeliveryadminComponent } from './pages/suleat-deliveryadmin/suleat-deliveryadmin.component';
import { SuleatOrderanalyticsComponent } from './pages/suleat-orderanalytics/suleat-orderanalytics.component';
import { SuleatHomeComponent } from './pages/suleat-home/suleat-home.component';
import { ErrorwrongpageComponent } from './components/errorwrongpage/errorwrongpage.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { FelicityProductlistComponent } from './pages/felicity-productlist/felicity-productlist.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoadingComponent,
    HomeComponent,
    SidebarContentComponent,
    LoginSelectComponent,
    SettingsComponent,
    SuleatSettingsComponent,
    ErrorpageComponent,
    UserListComponent,
    ViewUserComponent,
    NewUserInputComponent,
    FelicitySalesadminComponent,
    FelicityProductionadminComponent,
    FelicityDeliveryadminComponent,
    FelicityOrderanalyticsComponent,
    SuleatSalesadminComponent,
    SuleatProductionadminComponent,
    SuleatDeliveryadminComponent,
    SuleatOrderanalyticsComponent,
    SuleatHomeComponent,
    ErrorwrongpageComponent,
    ResetPasswordComponent,
    FelicityProductlistComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatSelectModule,
    MatSidenavModule,
    MatMenuModule,
    MatDialogModule,
    MatSlideToggleModule,
    _MatSlideToggleRequiredValidatorModule,
    MatTreeModule,
    CdkAccordionModule,
    MatPaginatorModule,
    MatTableModule,
    NgFor,
    MatSnackBarModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
     MatFormFieldModule, 
     NgIf
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  
  providers: [
    SidebarContentComponent,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
