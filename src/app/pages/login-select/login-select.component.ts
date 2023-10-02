import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SessionService } from "src/app/services/session/session.service";
@Component({
  selector: "app-login-select",
  templateUrl: "./login-select.component.html",
  styleUrls: ["./login-select.component.css"],
})
export class LoginSelectComponent implements OnInit {
  constructor(private router: Router, private session: SessionService) {}

  async ngOnInit() {
    await this.session.checkSession();
  }
  navigateFelicityHome() {
    this.router.navigate(["home"]);
  }
  navigateSuleatHome() {
    this.router.navigate(["suleat-home"]);
  }
}
