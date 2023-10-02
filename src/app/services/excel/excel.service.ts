import { DatePipe } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Workbook } from "exceljs";
import { saveAs } from 'file-saver-es';
import { Observable, map } from "rxjs";
import { LocalstorageService } from "../localstorage/localstorage.service";
import { environment } from "src/app/environment/environment";

@Injectable({
  providedIn: "root",
})
export class ExcelService {
  serverAPI = environment.serverAPI;
  constructor(
    private datePipe: DatePipe,
    private http: HttpClient,
    private locstorage: LocalstorageService
  ) {}

  async exportExcelPriceList(pricelist: any) {
    const accessToken = await this.locstorage.getData("accessToken");
    const url = `${this.serverAPI}/api/products/felicity/prices/export/${pricelist.id}`;
    const start_effectivity_date = this.datePipe.transform(
      pricelist.start_effectivity_date,
      "MMM_dd_yyyy"
    );
    const end_effectivity_date = this.datePipe.transform(
      pricelist.end_effectivity_date,
      "MMM_dd_yyyy"
    );
    const filename = `Felicity_Price_List_${start_effectivity_date}_TO_${end_effectivity_date}`;
    this.http
      .get(url, {
        headers: { authorization: `Bearer ${accessToken}` },
        observe: "response",
        responseType: "blob",
      })
      .pipe(map((res: any) => res.body))
      .subscribe(
        (data: Blob) => {
          saveAs(data, `${filename}.xlsx`);
        },
        (err: any) => {}
      );
  }

  async exportExcelFelicitiyProductList(search: string, item_category: String) {
    const accessToken = await this.locstorage.getData("accessToken");
    const url = `${this.serverAPI}/api/products/felicity/export/`;
    const now = Date.now();
    const fileDate = this.datePipe.transform(now, "MMM_dd_yyyy");
    const filename = `Felicity_Product_List_${fileDate}`;
    this.http
      .get(url, {
        headers: { authorization: `Bearer ${accessToken}` },
        params: new HttpParams()
          .set("query", search)
          .set("item_category", `${item_category}`),
        observe: "response",
        responseType: "blob",
      })
      .pipe(map((res: any) => res.body))
      .subscribe(
        (data: Blob) => {
          saveAs(data, `${filename}.xlsx`);
        },
        (err: any) => {
          console.error(err);
        }
      );
  }
  async exportExcelSuleatProductList(search: string, item_category: String) {
    const accessToken = await this.locstorage.getData("accessToken");
    const url = `${this.serverAPI}/api/products/suleat/export/`;
    const now = Date.now();
    const fileDate = this.datePipe.transform(now, "MMM_dd_yyyy");
    const filename = `Suleat_Product_List_${fileDate}`;
    this.http
      .get(url, {
        headers: { authorization: `Bearer ${accessToken}` },
        params: new HttpParams()
          .set("query", search)
          .set("item_category", `${item_category}`),
        observe: "response",
        responseType: "blob",
      })
      .pipe(map((res: any) => res.body))
      .subscribe(
        (data: Blob) => {
          saveAs(data, `${filename}.xlsx`);
        },
        (err: any) => {}
      );
  }

  async exportExcelSuleatPriceList() {
    const accessToken = await this.locstorage.getData("accessToken");
    const url = `${this.serverAPI}/api/products/suleat/prices/export`;
    const now = Date.now();
    const fileDate = this.datePipe.transform(now, "MMM_dd_yyyy");
    const filename = `Suleat_Price_List_${fileDate}`;

    this.http
      .get(url, {
        headers: { authorization: `Bearer ${accessToken}` },
        observe: "response",
        responseType: "blob",
      })
      .pipe(map((res: any) => res.body))
      .subscribe(
        (data: Blob) => {
          saveAs(data, `${filename}.xlsx`);
        },
        (err: any) => {}
      );
  }
}
