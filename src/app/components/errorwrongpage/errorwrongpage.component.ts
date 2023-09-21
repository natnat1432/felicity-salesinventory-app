import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
@Component({
  selector: 'app-errorwrongpage',
  templateUrl: './errorwrongpage.component.html',
  styleUrls: ['./errorwrongpage.component.css']
})
export class ErrorwrongpageComponent implements OnInit {
  constructor(
    private locstorage:LocalstorageService,
    private router:Router,
    private session:SessionService
  ){

  }
  async ngOnInit() {
    await this.session.checkSession()
  }

  async navigateHome(){
    const system_category = await this.locstorage.getData("system_category")
    if(system_category == "felicity")
    {
      this.router.navigate(["home"])      
    }
    if(system_category == "suleat")
    {
      this.router.navigate(["suleat-home"])
    }
  }
}
