import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocalstorageService } from "src/app/services/localstorage/localstorage.service";
import { SessionService } from "src/app/services/session/session.service";
import { UtilService } from "src/app/services/util/util.service";
@Component({
  selector: "app-suleat-settings",
  templateUrl: "./suleat-settings.component.html",
  styleUrls: ["./suleat-settings.component.css"],
})
export class SuleatSettingsComponent implements OnInit {
  isLoading: boolean = false;
  page: string = "Settings";
  view: string = "suleat";
  userCategory:any;
  constructor(
    private router: Router,
    private session: SessionService,
    private util: UtilService,
    private locstorage:LocalstorageService,
  ) {}

  async ngOnInit() {
    await this.util.checkNewUser();
    await this.util.checkSuleat();
    await this.session.checkSession();
    this.userCategory = await this.locstorage.getData("user_category")
  }

  navigateUserList() {
    this.router.navigate([`user-list`], {
      queryParams: {
        view: this.view,
      },
    });
  }

  navigateProductList() {
    this.router.navigate([`suleat-productlist`], {
      queryParams: {
        view: this.view,
      },
    });
  }

  navigatePriceList(){
    this.router.navigate([`suleat-pricelistview`],{
      queryParams:{
        view:this.view,
      }
    })
  }
}
