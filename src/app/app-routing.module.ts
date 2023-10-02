import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
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
import { FelicitySupplierlistComponent } from './pages/felicity-supplierlist/felicity-supplierlist.component';
import { ViewSupplierComponent } from './pages/view-supplier/view-supplier.component';
import { ViewFelicityproductComponent } from './pages/view-felicityproduct/view-felicityproduct.component';
import { FelicityPricelistComponent } from './pages/felicity-pricelist/felicity-pricelist.component';
import { FelicityMarketcompetitorsComponent } from './pages/felicity-marketcompetitors/felicity-marketcompetitors.component';
import { FelicityPricelistviewComponent } from './pages/felicity-pricelistview/felicity-pricelistview.component';
import { SuleatProductlistComponent } from './pages/suleat-productlist/suleat-productlist.component';
import { ViewSuleatproductComponent } from './pages/view-suleatproduct/view-suleatproduct.component';
import { SuleatPricelistviewComponent } from './pages/suleat-pricelistview/suleat-pricelistview.component';
import { ViewUserprofileComponent } from './pages/view-userprofile/view-userprofile.component';

const routes: Routes = [
  {
    path:'', component:LoginComponent
  },
  {
    path:'login', component:LoginComponent
  },
  {
    path:'home', component:HomeComponent
  },
  {
    path:'login-select', component:LoginSelectComponent
  },
  {
    path:'settings',component:SettingsComponent
  },
  {
    path:'suleat-settings', component:SuleatSettingsComponent
  },
  {
    path:'user-list', component:UserListComponent
  },
  {
    path:'new-user-input', component:NewUserInputComponent
  },
  {
    path:'felicity-salesadmin', component:FelicitySalesadminComponent
  },
  {
    path:'felicity-productionadmin', component:FelicityProductionadminComponent
  },
  {
    path:'felicity-deliveryadmin', component:FelicityDeliveryadminComponent
  },
  {
    path:'felicity-orderanalytics', component:FelicityOrderanalyticsComponent
  },
  {
    path:'felicity-productlist', component:FelicityProductlistComponent
  },
  {
    path:'felicity-supplierlist', component:FelicitySupplierlistComponent
  },
  {
    path:'felicity-pricelist', component:FelicityPricelistComponent
  },
  {
    path:'felicity-pricelistview', component:FelicityPricelistviewComponent
  },
  {
    path:'felicity-marketcompetitors', component:FelicityMarketcompetitorsComponent
  },
  {
    path:'suleat-salesadmin', component:SuleatSalesadminComponent
  },
  {
    path:'suleat-productionadmin', component:SuleatProductionadminComponent
  },
  {
    path:'suleat-deliveryadmin', component:SuleatDeliveryadminComponent
  },
  {
    path:'suleat-home', component:SuleatHomeComponent
  },
  {
    path:'suleat-orderanalytics', component:SuleatOrderanalyticsComponent
  },
  {
    path:'suleat-productlist', component:SuleatProductlistComponent
  },
  {
    path:'suleat-pricelistview', component:SuleatPricelistviewComponent
  },
  {
    path:'view-user', component:ViewUserComponent
  },
  {
    path:'view-supplier', component:ViewSupplierComponent
  },
  {
    path:'view-felicityproduct', component:ViewFelicityproductComponent 
  },
  {
    path:'view-suleatproduct', component:ViewSuleatproductComponent
  },
  {
    path:'view-userprofile', component:ViewUserprofileComponent
  },
  {
    path:'offlimits', component:ErrorwrongpageComponent
  },
  {
    path:'reset-password', component:ResetPasswordComponent
  },
  {
    path:'error-page', component:ErrorpageComponent
  },
  {
    path:'**', component:ErrorpageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
