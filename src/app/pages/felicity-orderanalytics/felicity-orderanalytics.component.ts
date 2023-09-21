import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session/session.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-felicity-orderanalytics',
  templateUrl: './felicity-orderanalytics.component.html',
  styleUrls: ['./felicity-orderanalytics.component.css']
})
export class FelicityOrderanalyticsComponent implements OnInit{
  isLoading:boolean = false
  page:string = "Felicity Order Analytics"
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
