import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';
import { SessionService } from 'src/app/services/session/session.service';

@Component({
  selector: 'app-view-userprofile',
  templateUrl: './view-userprofile.component.html',
  styleUrls: ['./view-userprofile.component.css']
})
export class ViewUserprofileComponent implements OnInit{
  isLoading:boolean = false
  page: string = "View Profile";
  view: string = "";

  constructor(
    private locstorage:LocalstorageService,
    private http:HttpClient,
    private session:SessionService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
  ){
    this.activatedRoute.queryParams.subscribe((params) => {
      this.view = params["view"];
    });
    if(this.view !== "felicity" &&  this.view !== "suleat")
    {
      this.router.navigate(["offlimits"])
    }
  }


  async ngOnInit(){
    await this.session.checkSession()
    

  }

}
