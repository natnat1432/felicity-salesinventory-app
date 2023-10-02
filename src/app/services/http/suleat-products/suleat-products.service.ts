import { Injectable } from "@angular/core";
import { UtilService } from "../../util/util.service";
import { LocalstorageService } from "../../localstorage/localstorage.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/app/environment/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class SuleatProductsService {
  serverAPI = environment.serverAPI;
  constructor(
    private util: UtilService,
    private locstorage: LocalstorageService,
    private http: HttpClient
  ) {}

  async addSuleatProduct(formData: any): Promise<Observable<any>> {
    const accessToken = await this.locstorage.getData("accessToken");
    const creator_id = await this.locstorage.getData("id");
    formData.creator_id = creator_id;
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const url = `${this.serverAPI}/api/products/suleat/`;
    return this.http.post<any>(url, formData, options);
  }

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
    const url = `${this.serverAPI}/api/products/suleat/active/`;
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
    const url = `${this.serverAPI}/api/products/suleat/inactive/`;
    return this.http.get<any>(url, options);
  }

  public async getProduct(product_id: string) {
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const url = `${this.serverAPI}/api/products/suleat/find/${product_id}`;
    return this.http.get<any>(url, options);
  }

  public async getProductLogs(product_id: string) {
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const url = `${this.serverAPI}/api/products/suleat/logs/${product_id}`;
    return this.http.get<any>(url, options);
  }

  public async updateProductVisibility(product_id: string, formData: any) {
    const accessToken = await this.locstorage.getData("accessToken");
    const creator_id = await this.locstorage.getData("id");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      params: new HttpParams().set("creator_id", `${creator_id}`),
    };
    const url = `${this.serverAPI}/api/products/suleat/status/${product_id}`;
    return this.http.put<any>(url, formData, options);
  }

  public async updateProduct(product_id: string, formData: any) {
    const accessToken = await this.locstorage.getData("accessToken");
    const creator_id = await this.locstorage.getData("id");

    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      params: new HttpParams().set("creator_id", `${creator_id}`),
    };

    const url = `${this.serverAPI}/api/products/suleat/${product_id}`;
    return this.http.put<any>(url, formData, options);
  }
}
