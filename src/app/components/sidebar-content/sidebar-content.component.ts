import { Component, Input } from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from "@angular/material/dialog";
import { NgIf } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { Router } from "@angular/router";
import { LocalstorageService } from "src/app/services/localstorage/localstorage.service";
import { SessionService } from "src/app/services/session/session.service";
import { UtilService } from "src/app/services/util/util.service";
@Component({
  selector: "app-sidebar-content",
  templateUrl: "./sidebar-content.component.html",
  styleUrls: ["./sidebar-content.component.css"],
})
export class SidebarContentComponent {
  @Input() page: any;
  @Input() view: any;
  public toggleState: boolean = true;
  public drawer: MatDrawer | undefined;
  static toggleStage: boolean;
  system_category: any;
  tabs: any;
  email: any;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private locstorage: LocalstorageService,
    private session: SessionService,
    private util: UtilService
  ) {}

  async ngOnInit() {
    await this.util.checkResetPassword();
    this.system_category = await this.locstorage.getData("system_category");
    this.email = await this.locstorage.getData("email");
    this.tabs = await this.locstorage.getData("tabs");
    for (let tab in this.tabs) {
      this.tabs[tab] = this.tabs[tab].replace(" ", "_").toLowerCase();
    }
  }

  async drawerToggle() {
    this.toggleState = !this.toggleState;
    this.drawer?.toggle();
  }

  getToggle() {
    return this.toggleState;
  }

  navigateProfile(){
    this.router.navigate([`view-userprofile`],{
      queryParams:{
        view:this.view
      }
    })
  }
  openLogoutDialog(): void {
    const dialogRef = this.dialog.open(LogoutDialog);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.session.logout();
        this.util.openSnackBar("Logout successful", "OK");
      }
    });
  }
  navigateFelicitySalesAdmin() {
    this.router.navigate(["felicity-salesadmin"]);
  }
  navigateFelicityProductionAdmin() {
    this.router.navigate(["felicity-productionadmin"]);
  }
  navigateFelicityDeliveryAdmin() {
    this.router.navigate(["felicity-deliveryadmin"]);
  }
  navigateFelicityOrderAnalytics() {
    this.router.navigate(["felicity-orderanalytics"]);
  }
  navigateSettings() {
    if (this.view == "felicity") this.router.navigate(["settings"]);
    else this.router.navigate(["suleat-settings"]);
  }
  navigateSuleatSalesAdmin() {
    this.router.navigate(["suleat-salesadmin"]);
  }
  navigateSuleatProductionAdmin() {
    this.router.navigate(["suleat-productionadmin"]);
  }
  navigateSuleatDeliveryAdmin() {
    this.router.navigate(["suleat-deliveryadmin"]);
  }
  navigateSuleatOrderAnalytics() {
    this.router.navigate(["suleat-orderanalytics"]);
  }

  changeProduct() {
    if (this.view == "felicity") {
      this.router.navigate(["home"]);
    } else {
      this.router.navigate(["suleat-home"]);
    }
  }


}

@Component({
  selector: "logout-dialog",
  templateUrl: "../dialogs/UserAccount/logout-dialog.html",
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class LogoutDialog {
  confirm: boolean = true;
  constructor(public dialogRef: MatDialogRef<LogoutDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
