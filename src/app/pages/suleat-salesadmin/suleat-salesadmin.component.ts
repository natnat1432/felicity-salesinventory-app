import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session/session.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: "app-suleat-salesadmin",
  templateUrl: "./suleat-salesadmin.component.html",
  styleUrls: ["./suleat-salesadmin.component.css"],
})
export class SuleatSalesadminComponent implements OnInit {
  isLoading: boolean = false;
  page: string = "Suleat Sales Admin";
  view: string = "suleat";

  constructor(
    private session: SessionService,
    private util:UtilService,
    ) {}
  async ngOnInit() {
    await this.util.checkNewUser()
    await this.util.checkSuleat()
    await this.session.checkSession();
  }
}
