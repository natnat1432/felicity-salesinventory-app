import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LocalstorageService } from "../../localstorage/localstorage.service";
import { UtilService } from "../../util/util.service";
import { environment } from "src/app/environment/environment";
@Injectable({
  providedIn: "root",
})
export class MarketcompetitorsService implements OnInit {
  serverAPI = environment.serverAPI;
  constructor(
    private locstorage: LocalstorageService,
    private http: HttpClient,
    private util: UtilService
  ) {}

  ngOnInit(): void {}

  async getAllMarketCompetitors() {
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    const response = this.http
      .get(`${this.serverAPI}/api/products/felicity/competitors/`, options)
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );
    return await Promise.all([response, loadingPromise]).then(
      ([response]: any) => {
        return response;
      },
      (error) => {
        this.util.openSnackBar(error.error.message, "OK");
        return null;
      }
    );
  }
}
