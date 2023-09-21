import { Injectable } from "@angular/core";
import { LocalstorageService } from "../localstorage/localstorage.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/app/environment/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  constructor(
    private locstorage: LocalstorageService,
    private http: HttpClient,
    private router: Router,
  ) {}

  saveSession(data: any) {
    for (const key in data.userData) {
      if (data.userData.hasOwnProperty(key)) {
          this.locstorage.saveData(key, data.userData[key])
      }
    }
    for (const key in data.token) {
      if (data.token.hasOwnProperty(key)) {
          this.locstorage.saveData(key, data.token[key])
      }
    }
  }

  async checkSession() {
    const accessToken = await this.locstorage.getData("accessToken");
    if (accessToken == null) {
      this.router.navigate([""]);
    } else {
      const formData = {
        accessToken: accessToken,
      };

      this.http
        .post(`${environment.serverAPI}/api/auth/token/validate`, formData)
        .subscribe(
          (response: any) => {
            if (response.valid === true) {
            } else {
              this.refreshToken();
            }
          },
          (error: any) => {
            if (error.error.valid === false) {
              this.refreshToken();
            } else {
              console.warn('Error checking session', error)
            }
          }
        );
    }
  }
  async checkSessionLogin() {
    const accessToken = await this.locstorage.getData("accessToken");
    if (accessToken == null) {
      this.router.navigate([""]);
    } else {
      const formData = {
        accessToken: accessToken,
      };

      this.http
        .post(`${environment.serverAPI}/api/auth/token/validate`, formData)
        .subscribe(
          async (response: any) => {
            if (response.valid === true) {
              //util redirect here
              const system_category = await this.locstorage.getData("system_category")
              if(system_category == 'all')
              {
                this.router.navigate(["login-select"])
              }
              if(system_category == 'felicity'){
                this.router.navigate(["home"])
              }
              if(system_category == 'suleat'){
                this.router.navigate(["suleat-home"])
              }
            } else {
            }
          },
          (error: any) => {
            if (error.error.valid === false) {
            } else {
              console.warn('Error checking session', error)
            }
          }
        );
    }
  }
  async refreshToken() {
    const refreshToken = await this.locstorage.getData("refreshToken");
    if (refreshToken == null) {
      this.router.navigate([""]);
    } else {
      const formData = {
        token: refreshToken,
      };
      this.http
        .post(`${environment.serverAPI}/api/auth/token`, formData)
        .subscribe(
          (response: any) => {
            if (response.valid === true && response.success === true) {
              this.locstorage.saveData("accessToken", response.accessToken);
            }
          },
          (error) => {
            if (error.error.valid === false || error.error.success === false) {
              this.locstorage.clearData();
              this.router.navigate([""]);
            }
            // console.warn('Error refreshing token', error)
          }
        );
    }
  }

  async logout() {
    const refreshToken: any = await this.locstorage.getData("refreshToken");
    if (refreshToken == null) {
      this.router.navigate([""]);
    } else {
      const options = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          token: refreshToken,
        }),
      };
      this.http
        .delete(`${environment.serverAPI}/api/auth/logout`, options)
        .subscribe(
          (response: any) => {
            this.locstorage.clearData();
      
            this.router.navigate(["/"]);
          },
          (error) => {
            // console.warn(error)
          }
        );
    }
  }
}
