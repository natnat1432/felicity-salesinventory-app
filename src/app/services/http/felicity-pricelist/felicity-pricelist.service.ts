import { Injectable } from "@angular/core";
import { LocalstorageService } from "../../localstorage/localstorage.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/app/environment/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FelicityPricelistService {
  serverAPI = environment.serverAPI;
  constructor(
    private locstorage: LocalstorageService,
    private http: HttpClient
  ) {}

  public async updatePriceList(formData: any): Promise<Observable<any>> {
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const url = `${this.serverAPI}/api/products/felicity/prices/${formData.id}`;
    return this.http.put<any>(url, formData, options);
  }
}
