import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocalstorageService } from "src/app/services/localstorage/localstorage.service";
import { SessionService } from "src/app/services/session/session.service";
import { UtilService } from "src/app/services/util/util.service";
@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  isLoading: boolean = false;
  page = "Settings";
  view: string = "felicity";
  userCategory:any;
  constructor(
    private router: Router,
    private session: SessionService,
    private util: UtilService,
    private locstorage:LocalstorageService,
  ) {}
  async ngOnInit() {
    await this.util.checkNewUser();
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
    this.router.navigate([`felicity-productlist`], {
      queryParams: {
        view: this.view,
      },
    });
  }
  navigateSupplierList() {
    this.router.navigate([`felicity-supplierlist`], {
      queryParams: {
        view: this.view,
      },
    });
  }
  navigateFelicityPriceList() {
    this.router.navigate([`felicity-pricelist`], {
      queryParams: {
        view: this.view,
      },
    });
  }
}
