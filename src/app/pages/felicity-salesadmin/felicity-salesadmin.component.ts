import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session/session.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: "app-felicity-salesadmin",
  templateUrl: "./felicity-salesadmin.component.html",
  styleUrls: ["./felicity-salesadmin.component.css"],
})
export class FelicitySalesadminComponent implements OnInit {
  isLoading: boolean = false;
  page: string = "Felicity Sales Admin";
  view: string = "felicity";

  constructor(
    private session: SessionService,
    private util:UtilService
    ) {}
  async ngOnInit() {
    await this.util.checkNewUser()
    await this.util.checkFelicity()
    await this.session.checkSession();
  }
}
