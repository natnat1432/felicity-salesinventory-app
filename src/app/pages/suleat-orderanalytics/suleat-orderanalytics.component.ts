import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session/session.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: "app-suleat-orderanalytics",
  templateUrl: "./suleat-orderanalytics.component.html",
  styleUrls: ["./suleat-orderanalytics.component.css"],
})
export class SuleatOrderanalyticsComponent implements OnInit {
  isLoading: boolean = false;
  page: string = "Suleat Order Analytics";
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
