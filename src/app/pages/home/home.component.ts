import { Component, OnInit,TemplateRef } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { SessionService } from 'src/app/services/session/session.service';
import { UtilService } from 'src/app/services/util/util.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoading:boolean = false
  page:string = ""
  view:string = "felicity"
  constructor(
    private session:SessionService,
    private util:UtilService
  ){

  }
  async ngOnInit() {
    await this.util.checkNewUser()
    await this.util.checkFelicity()
    await this.session.checkSession()
  }


}
