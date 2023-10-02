import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UtilService } from "src/app/services/util/util.service";
import { environment } from "src/app/environment/environment";
import { SessionService } from "src/app/services/session/session.service";
import { Router } from "@angular/router";
import { LocalstorageService } from "src/app/services/localstorage/localstorage.service";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  email: string = "";
  password: string = "";
  constructor(
    private http: HttpClient,
    private util: UtilService,
    private session: SessionService,
    private router: Router,
    private locstorage: LocalstorageService
  ) {}

  async ngOnInit() {
    await this.session.checkSessionLogin();
  }
  async login() {
    if (this.email && this.password) {
      this.isLoading = true;
      const formData = {
        email: this.email,
        password: this.password,
      };
      const response = this.http
        .post(`${environment.serverAPI}/api/auth/login`, formData)
        .toPromise();
      const loadingPromise = new Promise((resolve) =>
        setTimeout(resolve, environment.loadingTime)
      );
      return await Promise.all([response, loadingPromise]).then(
        async ([response]: any) => {
          if (response) {
            this.isLoading = false;
            this.session.saveSession(response);
            const user_category = await this.locstorage.getData(
              "user_category"
            );
            this.util.openSnackBar("Login successful", "OK");
            if (user_category == "Superadmin")
              this.router.navigate(["login-select"]);
            else {
              const department = await this.locstorage.getData("department");
              const firstname = await this.locstorage.getData("firstname");
              const lastname = await this.locstorage.getData("lastname");

              if (!department && !firstname && !lastname) {
                this.router.navigate(["new-user-input"]);
              } else {
                this.util.redirectUser();
              }
            }
          } else {
            this.isLoading = false;
            this.util.openSnackBar("Invalid log in", "OK");
          }
        },
        (error) => {
          this.isLoading = false;
          this.util.openSnackBar(error.error.message, "OK");
        }
      );
    } else {
      this.util.openSnackBar("Please fill all the fields completely", "OK");
    }
  }
}
