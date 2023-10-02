import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { SessionService } from "../session/session.service";
import { LocalstorageService } from "../localstorage/localstorage.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/app/environment/environment";
import { Router } from "@angular/router";
@Injectable({
  providedIn: "root",
})
export class UtilService {
  constructor(
    private _snackBar: MatSnackBar,
    private session: SessionService,
    private locstorage: LocalstorageService,
    private http: HttpClient,
    private router: Router
  ) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  async checkNewUser() {
    const firstname = await this.locstorage.getData("firstname");
    const lastname = await this.locstorage.getData("lastname");
    const department = await this.locstorage.getData("department");
    if (firstname == null && lastname == null && department == null) {
      this.session.logout();
    }
  }

  async checkFelicity() {
    const system_category = await this.locstorage.getData("system_category");
    if (system_category == "suleat") {
      this.router.navigate(["offlimits"]);
    }
  }
  async checkSuleat() {
    const system_category = await this.locstorage.getData("system_category");
    if (system_category == "felicity") {
      this.router.navigate(["offlimits"]);
    }
  }

  async checkResetPassword() {
    const resetPassword = await this.locstorage.getData("reset_password");
    if (resetPassword) {
      this.router.navigate(["reset-password"]);
    }
  }

  async redirectUser() {
    const system_category = await this.locstorage.getData("system_category");
    if (system_category == "all") {
      this.router.navigate(["login-select"]);
    }
    if (system_category == "felicity") {
      this.router.navigate(["home"]);
    }
    if (system_category == "suleat") {
      this.router.navigate(["suleat-home"]);
    }
  }

  async createLogging(description: string) {
    const accessToken = await this.locstorage.getData("accessToken");
    const account_id = await this.locstorage.getData("id");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const loggingData = {
      creator_id: account_id,
      description: description,
    };
    this.http
      .post(`${environment.serverAPI}/api/loggings`, loggingData, options)
      .subscribe(
        (response) => {},
        (error) => {}
      );
  }

  formatDate(date: Date): string {
    var finaldate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    finaldate = finaldate.replaceAll("/", "-");
    return finaldate;
  }

   isIterable(obj:any) {
    return typeof obj[Symbol.iterator] === 'function';
  }
  
}
