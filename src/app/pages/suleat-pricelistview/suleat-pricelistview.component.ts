import { DatePipe, JsonPipe } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { LocalstorageService } from "src/app/services/localstorage/localstorage.service";
import { SessionService } from "src/app/services/session/session.service";
import { UtilService } from "src/app/services/util/util.service";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatRadioModule } from "@angular/material/radio";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SupplierService } from "src/app/services/http/supplier/supplier.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { NgIf, NgFor } from "@angular/common";
import { environment } from "src/app/environment/environment";
import { filter, take } from "rxjs";
import { MarketcompetitorsService } from "src/app/services/http/marketcompetitors/marketcompetitors.service";
import { FelicityPricelistService } from "src/app/services/http/felicity-pricelist/felicity-pricelist.service";
import { ExcelService } from "src/app/services/excel/excel.service";
import { SuleatProductsService } from "src/app/services/http/suleat-products/suleat-products.service";
import { SuleatPricelistService } from "src/app/services/http/suleat-pricelist/suleat-pricelist.service";
import { MatListModule } from "@angular/material/list";

@Component({
  selector: "app-suleat-pricelistview",
  templateUrl: "./suleat-pricelistview.component.html",
  styleUrls: ["./suleat-pricelistview.component.css"],
})
export class SuleatPricelistviewComponent implements OnInit {
  view: string = "suleat";
  isLoading: boolean = false;
  page: string = "Suleat Price List";
  isEdit: boolean = false;
  serverAPI: string = environment.serverAPI;
  displayedColumns: string[] = [
    "ProductID",
    "ProductCode",
    "ProductName",
    "Price",
    "Action",
  ];
  dataSource: any[] = [];
  constructor(
    private session: SessionService,
    private util: UtilService,
    private router: Router,
    private locstorage: LocalstorageService,
    private http: HttpClient,
    public datePipe: DatePipe,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private excelservices: ExcelService,
    private suleatPriceList: SuleatPricelistService,
    private excelservice:ExcelService,
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.view = params["view"];
    });
  }

  async ngOnInit() {
    await this.util.checkNewUser();
    await this.util.checkFelicity();
    await this.session.checkSession();
    await this.getPricesLists();
  }

  navigateSettings() {
    this.router.navigate([`suleat-settings`], {
      queryParams: {
        view: this.view,
      },
    });
  }
  async exportPriceList() {
    await this.excelservice.exportExcelSuleatPriceList()
  }
  setEdit() {
    this.isEdit = !this.isEdit;
  }


  async getPricesLists() {
    (await this.suleatPriceList.getProductPriceList()).subscribe(
      (response: any) => {
        console.log(response);
        this.dataSource = response;
        if (this.dataSource) {
          for (let each of this.dataSource) {
            each.isSave = false;
            each.isSaved = false;
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  openAddProduct() {
    const dialogRef = this.dialog.open(AddSuleatPriceList, {
      data: { suleatPricelists: this.dataSource },
    });

    dialogRef.afterClosed().subscribe(async (response) => {
      dialogRef.close();
      this.dialog.closeAll;
      if (response) {
        await this.addProduct(response);
      }
    });
  }

  async addProduct(formData: any) {
    this.isLoading = true;
    const createdBy = await this.locstorage.getData("id");
    formData["createdBy"] = createdBy;

    const response = (
      await this.suleatPriceList.addProductPriceList(formData)
    ).toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      ([response]: any) => {
        this.isLoading = false;
        console.log(response);
        this.util.openSnackBar(response.message, "OK");
      },
      (error) => {
        this.isLoading = false;
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }

  updatePriceList(pricelist: any) {
    if (!pricelist.isSave) {
      pricelist.isSave = true;
      const finalPriceList = pricelist
      this.updateProduct(finalPriceList);
    } else {
      pricelist.isSave = false;
      this.util.openSnackBar("Update price cancelled", "OK");
    }
  }

  async updateProduct(formData: any) {

    const createdBy = await this.locstorage.getData("id");
    const finalForm = {
      product_id:formData.product_id,
      item_price:formData.latestItemPrice,
      createdBy:createdBy,
    };

    (await this.suleatPriceList.updateProductPriceList(finalForm)).subscribe(
      (response: any) => {
        this.util.openSnackBar(response.message, "OK");
        formData.isSave = false
        formData.isSaved = true
      },
      (error) => {
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }

  showEditHistory(product_id:number) {
    console.log("Product ID", product_id);
    const dialogRef = this.dialog.open(ViewPriceListHistory, {
      data: { product_id: product_id },
    });

    dialogRef.afterClosed().subscribe(async (response) => {
      dialogRef.close();
      this.dialog.closeAll;
    });
  }
}

//Dialog for Adding Products to Price List
@Component({
  selector: "add-suleat-pricel-list-dialog",
  templateUrl:
    "../../components/dialogs/SuleatPriceList/add-suleat-price-list-dialog.html",
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    NgIf,
    NgFor,
  ],
})
export class AddSuleatPriceList implements OnInit {
  suleatProducts: any;
  selectSuleatProduct = new FormGroup({
    product_id: new FormControl("", Validators.required),
    item_price: new FormControl("", Validators.required),
  });
  constructor(
    public dialogRef: MatDialogRef<AddSuleatPriceList>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private suleatProduct: SuleatProductsService,
    private util: UtilService,
  ) {}

  async ngOnInit() {
    await this.getSuleatProduct();


  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onChangeRadio(supplier: any) {
    this.selectSuleatProduct.patchValue({
      product_id: supplier.id,
    });
  }

  async getSuleatProduct() {
    (await this.suleatProduct.getActiveProducts("", "All")).subscribe(
      async (response) => {
        if (response) {
          var filteredProducts = [];
          var priceLists = this.data.suleatPricelists;

          for (let product of response) {
            for (let pricelist of priceLists) {
              if (product.item_code != pricelist.item_code) {
                filteredProducts.push(product);
              }
            }
          }
          this.suleatProducts = filteredProducts;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
//Dialog for showing product list history
@Component({
  selector: "view-suleat-price-list-history-dialog",
  templateUrl:
    "../../components/dialogs/SuleatPriceList/view-suleat-price-list-history-dialog.html",
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatListModule,
    NgIf,
    NgFor,
  ],
})
export class ViewPriceListHistory implements OnInit {
  pricelistHistory: any;
  constructor(
    public dialogRef: MatDialogRef<ViewPriceListHistory>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private suleatpriceList:SuleatPricelistService,
    private util: UtilService,
    public datePipe:DatePipe
  ) {}

  async ngOnInit() {
    await this.getProductPriceHistory()
  }

  async getProductPriceHistory(){
    const response = (await this.suleatpriceList.getProductPriceListHistory(this.data.product_id)).toPromise()
    const loadingPromise = new Promise(resolve => setTimeout(resolve , environment.loadingTime))

    return await Promise.all([response,loadingPromise])
      .then(
        ([response]:any)  => {
          console.log(response)
          this.pricelistHistory = response
        },
        (error) => {
          console.log(error)
        }
      )
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
