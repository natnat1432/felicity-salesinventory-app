import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session/session.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: "app-suleat-productionadmin",
  templateUrl: "./suleat-productionadmin.component.html",
  styleUrls: ["./suleat-productionadmin.component.css"],
})
export class SuleatProductionadminComponent implements OnInit {
  isLoading: boolean = false;
  page: string = "Suleat Production Admin";
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
