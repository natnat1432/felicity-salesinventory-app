import { Component, OnInit } from "@angular/core";
import { SessionService } from "src/app/services/session/session.service";
import { UtilService } from "src/app/services/util/util.service";

@Component({
  selector: "app-suleat-home",
  templateUrl: "./suleat-home.component.html",
  styleUrls: ["./suleat-home.component.css"],
})
export class SuleatHomeComponent implements OnInit {
  isLoading: boolean = false;
  page: string = "";
  view: string = "suleat";

  constructor(private session: SessionService, private util: UtilService) {}
  async ngOnInit() {
    await this.util.checkNewUser();
    await this.util.checkSuleat();
    await this.session.checkSession();
  }
}
