import { Injectable, OnInit } from "@angular/core";
import { LocalstorageService } from "../../localstorage/localstorage.service";
import { UtilService } from "../../util/util.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/app/environment/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FelicityProductsService implements OnInit {
  serverAPI = environment.serverAPI;
  constructor(
    private locstorage: LocalstorageService,
    private util: UtilService,
    private http: HttpClient
  ) {}

  async ngOnInit() {}

  getProductsPaginated() {}

  public async getActiveProducts(
    searchQuery: string,
    item_category: string
  ): Promise<Observable<any>> {
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      params: new HttpParams()
        .set("query", searchQuery)
        .set("item_category", item_category),
    };
    const url = `${this.serverAPI}/api/products/felicity/active/`;
    return this.http.get<any>(url, options);
  }

  public async getInactiveProducts(
    searchQuery: string,
    item_category: string
  ): Promise<Observable<any>> {
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      params: new HttpParams()
        .set("query", searchQuery)
        .set("item_category", item_category),
    };
    const url = `${this.serverAPI}/api/products/felicity/inactive/`;
    return this.http.get<any>(url, options);
  }
}
