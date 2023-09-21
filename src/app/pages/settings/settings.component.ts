import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { UtilService } from 'src/app/services/util/util.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    isLoading:boolean = false
    page = "Settings"
    view:string = "felicity"

    constructor(
      private router:Router,
      private session:SessionService,
      private util:UtilService
    ){

    }
    async ngOnInit() {
      await this.util.checkNewUser()
      await this.session.checkSession()
    }

    navigateUserList(){
      this.router.navigate([`user-list`],{
        queryParams:{
          view:this.view,
        }
      })
    }
    navigateProductList(){
      this.router.navigate([`felicity-productlist`], {
        queryParams:{
          view:this.view,
        }
      })
    }

}
