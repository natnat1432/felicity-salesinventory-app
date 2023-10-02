import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LocalstorageService } from "../../localstorage/localstorage.service";
import { environment } from "src/app/environment/environment";
import { UtilService } from "../../util/util.service";
@Injectable({
  providedIn: "root",
})
export class SupplierService implements OnInit {
  serverAPI = environment.serverAPI;

  constructor(
    private http: HttpClient,
    private locstorage: LocalstorageService,
    private util: UtilService
  ) {}

  async ngOnInit() {}

  async getSuppliers(category: string) {
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    var url;
    if (category == "All") {
      url = `${this.serverAPI}/api/suppliers/all/`;
    } else {
      url = `${this.serverAPI}/api/suppliers/category/${category}`;
    }

    const response = this.http.get(url, options).toPromise();
    const promise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );
    return await Promise.all([response, promise]).then(
      ([response]: any) => {
        return response.data;
      },
      (error) => {
        this.util.openSnackBar(error.error.message, "OK");
        return null;
      }
    );
  }
}
