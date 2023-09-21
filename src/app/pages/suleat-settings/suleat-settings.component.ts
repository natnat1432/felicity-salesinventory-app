import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { UtilService } from 'src/app/services/util/util.service';
@Component({
  selector: 'app-suleat-settings',
  templateUrl: './suleat-settings.component.html',
  styleUrls: ['./suleat-settings.component.css']
})
export class SuleatSettingsComponent implements OnInit {
  isLoading:boolean = false
  page:string = "Settings"
  view:string = "suleat"

  constructor(
    private router:Router,
    private session:SessionService,
    private util:UtilService
  ){

  }

  async ngOnInit(){
    await this.util.checkNewUser()
    await this.util.checkSuleat()
    await this.session.checkSession()
  }



  navigateUserList(){
    this.router.navigate([`user-list`],{
      queryParams:{
        view:this.view,
      }
    })
  }



}
