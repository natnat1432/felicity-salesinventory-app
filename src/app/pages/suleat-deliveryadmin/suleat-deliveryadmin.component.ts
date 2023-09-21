import { Component, OnInit } from "@angular/core";
import { SessionService } from "src/app/services/session/session.service";
import { UtilService } from "src/app/services/util/util.service";

@Component({
  selector: "app-suleat-deliveryadmin",
  templateUrl: "./suleat-deliveryadmin.component.html",
  styleUrls: ["./suleat-deliveryadmin.component.css"],
})
export class SuleatDeliveryadminComponent implements OnInit {
  isLoading: boolean = false;
  page: string = "Suleat Delivery Admin";
  view: string = "suleat";

  constructor(
    private session: SessionService,
    private util:UtilService
    ) {}
  async ngOnInit() {
    await this.util.checkNewUser()
    await this.util.checkSuleat()
    await this.session.checkSession();
    
  }
}
