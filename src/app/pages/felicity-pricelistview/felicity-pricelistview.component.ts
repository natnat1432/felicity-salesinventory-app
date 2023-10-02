import { DatePipe, JsonPipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
import { take } from "rxjs";
import { MarketcompetitorsService } from "src/app/services/http/marketcompetitors/marketcompetitors.service";
import { FelicityPricelistService } from "src/app/services/http/felicity-pricelist/felicity-pricelist.service";
import { ExcelService } from "src/app/services/excel/excel.service";
@Component({
  selector: "app-felicity-pricelistview",
  templateUrl: "./felicity-pricelistview.component.html",
  styleUrls: ["./felicity-pricelistview.component.css"],
})
export class FelicityPricelistviewComponent implements OnInit {
  isLoading: boolean = false;
  page: string = "Felicity Price Effectivity List View";
  view: string = "felicity";
  isEdit: boolean = false;
  serverAPI: string = environment.serverAPI;
  pricerange: any;
  pricerange_id: string = "";
  suppliers: any;
  markup_percentage: any;
  premium_percentage: any;
  displayedColumns: string[] = [
    "ProductID",
    "ProductName",
    "EffectivityDate",
    "PurchasingPrice",
    "SupplierID",
    "SupplierName",
    "SupplierCode",
    "StandardMarkupPercentage",
    "StandardPrice",
    "PremiumDiscountPercentage",
    "PremiumPrice",
    "Competitor1",
    "Competitor1Price",
    "Competitor2",
    "Competitor2Price",
    "Competitor3",
    "Competitor3Price",
    "Action",
  ];
  dataSource: any;
  constructor(
    private session: SessionService,
    private util: UtilService,
    private router: Router,
    private locstorage: LocalstorageService,
    private http: HttpClient,
    public datePipe: DatePipe,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private felicitypricelist: FelicityPricelistService,
    private excelservices: ExcelService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.pricerange_id = params["id"];
    });
  }

  async ngOnInit() {
    await this.util.checkNewUser();
    await this.util.checkFelicity();
    await this.session.checkSession();
    await this.getPriceRange();
    await this.getSuppliers();
    await this.getPriceLists();

    if (this.dataSource) {
      for (let each of this.dataSource) {
        each.isSave = false;
        each.isSaved = false;
      }
    }
  }

  navigatePriceList() {
    this.router.navigate(["felicity-pricelist"]);
  }
  async getPriceRange() {
    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    const response = this.http
      .get(
        `${this.serverAPI}/api/products/felicity/priceeffecitivity/find/${this.pricerange_id}`,
        options
      )
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      ([response]: any) => {
        this.isLoading = false;
        this.pricerange = response;
      },
      (error) => {
        this.isLoading = false;
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }

  async getPriceLists() {
    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    const response = this.http
      .get(
        `${this.serverAPI}/api/products/felicity/prices/${this.pricerange_id}`,
        options
      )
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      ([response]: any) => {
        this.isLoading = false;
        this.dataSource = response;
      },
      (error) => {
        this.isLoading = false;
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }

  async getSuppliers() {
    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    const response = this.http
      .get(`${this.serverAPI}/api/suppliers/all/`, options)
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      ([response]: any) => {
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }
  async openChooseSupplier(item_category: string, index: number) {
    let supplierDialogRef = this.dialog.open(SelectSupplierDialog, {
      data: { item_category: item_category },
    });

    supplierDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((value) => {
        if (value) {
          this.dataSource[index].supplier_code = value.supplier_code;
          this.dataSource[index].supplier_id = value.supplier_id;
          this.dataSource[index].supplier = {
            registered_name: value.supplier_name.registered_name,
          };
        }
        supplierDialogRef.close();
        this.dialog.closeAll();
      });
  }

  async openChooseMarketCompetitor(index: number, competitor: string) {
    let marketDialogRef = this.dialog.open(SelectMarketCompetitorDialog);

    marketDialogRef.afterClosed().subscribe((value) => {
      if (value) {
        const market_name = `${value.market_name.market_name}`;
        this.dataSource[index][competitor] = market_name;
      }
      marketDialogRef.close();
      this.dialog.closeAll();
    });
  }
  setPurchasingPrice(index: number) {
    var standard_price_percent = this.dataSource[index].standard_price_percent;
    var premium_price_percent = this.dataSource[index].premium_price_percent;
    if (standard_price_percent) {
      this.setStandardPrice(index);
    }
    if (premium_price_percent) {
      this.setPremiumPrice(index);
    }
  }
  setStandardPrice(index: number) {
    var percentage =
      Number(this.dataSource[index].standard_price_percent) / 100;
    var price = Number(this.dataSource[index].purchasing_price);
    if (price) {
      var standard_price = price + price * percentage;
      this.dataSource[index].standard_price = standard_price;
    }
  }

  setPremiumPrice(index: number) {
    var percentage = Number(this.dataSource[index].premium_price_percent) / 100;
    var standard_price = Number(this.dataSource[index].standard_price);
    if (standard_price) {
      var premium_price = standard_price - standard_price * percentage;
      this.dataSource[index].premium_price = premium_price;
    }
  }

  setPercentages() {
    for (let each of this.dataSource) {
      each.standard_price_percent = this.markup_percentage;
      each.premium_price_percent = this.premium_percentage;
    }
  }

  setEdit() {
    this.isEdit = !this.isEdit;
  }

  async updatePriceList(pricelist: any) {
    pricelist.isSave = true;
    const updateData = {
      id: pricelist.id,
      price_effectivity_id: pricelist.price_effectivity_id,
      product_id: pricelist.product_id,
      purchasing_price: pricelist.purchasing_price,
      supplier_id: pricelist.supplier_id,
      supplier_code: pricelist.supplier_code,
      standard_price_percent: pricelist.standard_price_percent,
      standard_price: pricelist.standard_price,
      premium_price_percent: pricelist.premium_price_percent,
      premium_price: pricelist.premium_price,
      competitor_one: pricelist.competitor_one,
      competitor_one_price: pricelist.competitor_one_price,
      competitor_two: pricelist.competitor_two,
      competitor_two_price: pricelist.competitor_two_price,
      competitor_three: pricelist.competitor_three,
      competitor_three_price: pricelist.competitor_three_price,
    };

    (await this.felicitypricelist.updatePriceList(updateData)).subscribe(
      (response: any) => {
        if (response.message) {
          pricelist.isSave = false;
          pricelist.isSaved = true;
          this.util.openSnackBar(response.message, "OK");
        }
      },
      (error) => {
        pricelist.isSave = false;
        this.util.openSnackBar(error.erorr.message, "OK");
      }
    );
  }
  async exportPriceList() {
    await this.excelservices.exportExcelPriceList(this.pricerange);
  }
}
//Dialog for Selecting Suppliers
@Component({
  selector: "select-supplier-dialog",
  templateUrl:
    "../../components/dialogs/FelicityPriceListTableDialog/select-supplier-dialog.html",
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
export class SelectSupplierDialog implements OnInit {
  supplierlist: any;
  selectSupplier = new FormGroup({
    supplier_name: new FormControl("", Validators.required),
    supplier_id: new FormControl("", Validators.required),
    supplier_code: new FormControl("", Validators.required),
  });
  constructor(
    public dialogRef: MatDialogRef<SelectSupplierDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private supplier: SupplierService
  ) {}

  async ngOnInit() {
    if (this.data) {
      this.supplierlist = await this.supplier.getSuppliers(
        this.data.item_category
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onChangeRadio(supplier: any) {
    this.selectSupplier.patchValue({
      supplier_id: supplier.id,
      supplier_code: supplier.code,
    });
  }
}
//Dialog for Selecting Market Competitors
@Component({
  selector: "select-marketcompetitor-dialog",
  templateUrl:
    "../../components/dialogs/FelicityPriceListTableDialog/select-marketcompetitor-dialog.html",
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
export class SelectMarketCompetitorDialog implements OnInit {
  marketCompetitors: any;
  selectMarketCompetitors = new FormGroup({
    market_name: new FormControl("", Validators.required),
  });
  constructor(
    public dialogRef: MatDialogRef<SelectMarketCompetitorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private marketcompetitor: MarketcompetitorsService
  ) {}

  async ngOnInit() {
    this.marketCompetitors =
      await this.marketcompetitor.getAllMarketCompetitors();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onChangeRadio(supplier: any) {}
}
