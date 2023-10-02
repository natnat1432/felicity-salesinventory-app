import { Injectable } from "@angular/core";
import { LocalstorageService } from "../../localstorage/localstorage.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/app/environment/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SuleatPricelistService {
  serverAPI = environment.serverAPI;
  constructor(
    private locstorage: LocalstorageService,
    private http: HttpClient
  ) {}

  async addProductPriceList(formData:any){
    const accessToken = await this.locstorage.getData("accessToken")

    const options = {
      headers:{
        authorization:`Bearer ${accessToken}`
      }
    }
    
    const url = `${this.serverAPI}/api/products/suleat/prices/`
    return this.http.post<any>(url, formData, options)
  }

  async updateProductPriceList(formData:any){
    const accessToken = await this.locstorage.getData("accessToken")
    const options = {
      headers:{
        authorization:`Bearer ${accessToken}`
      }
    }
    const url = `${this.serverAPI}/api/products/suleat/prices/update/`
    return this.http.post<any>(url, formData, options)
      
  }

  async getProductPriceList(){
    const accessToken = await this.locstorage.getData("accessToken")
    const options = {
      headers:{
        authorization:`Bearer ${accessToken}`
      }
    }
    const url = `${this.serverAPI}/api/products/suleat/prices/`
    return this.http.get<any>(url, options)
  }

  async getProductPriceListHistory(product_id:string){
    const accessToken = await this.locstorage.getData("accessToken")
    const options = {
      headers:{
        authorization:`Bearer ${accessToken}`
      }
    }
    const url = `${this.serverAPI}/api/products/suleat/prices/history/${product_id}`
    return this.http.get<any>(url,options)
  }

}
