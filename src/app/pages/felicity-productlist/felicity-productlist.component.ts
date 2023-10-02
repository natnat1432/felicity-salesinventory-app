import { DatePipe, JsonPipe, NgFor, NgIf } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
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
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Router } from "@angular/router";
import { environment } from "src/app/environment/environment";
import { ExcelService } from "src/app/services/excel/excel.service";
import { FelicityProductsService } from "src/app/services/http/felicity-products/felicity-products.service";
import { LocalstorageService } from "src/app/services/localstorage/localstorage.service";
import { SessionService } from "src/app/services/session/session.service";
import { UtilService } from "src/app/services/util/util.service";

@Component({
  selector: "app-felicity-productlist",
  templateUrl: "./felicity-productlist.component.html",
  styleUrls: ["./felicity-productlist.component.css"],
})
export class FelicityProductlistComponent implements OnInit {
  isLoading: boolean = false;
  page: string = "Felicity Product List";
  view: string = "felicity";
  searchInactiveFormControl = new FormControl("");
  inactive_item_category: string = "All";

  displayedColumns: string[] = [
    "item_code",
    "name",
    "type",
    "category",
    "brand",
    "packaging_unit",
    "quantity_per_unit",
    "unit_measure",
    "createdBy",
    "actions",
  ];
  dataSource: any[] = [];
  inactiveDataSource: any[] = [];
  searchFormControl = new FormControl("");
  tablepage: number = 0;
  pageSize: number = 5;
  dataMax: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  serverAPI: string = environment.serverAPI;
  item_category: string = "All";
  item_category_options: string[] = [
    "All",
    "Meat",
    "Produce",
    "Breading Mix",
    "Canned Goods",
    "Condiments",
    "Frozen Goods",
    "Industrial",
    "Nuts",
    "Oil",
    "Seasoning",
    "Spices",
    "Dressing",
    "Grains",
  ];
  constructor(
    private session: SessionService,
    private util: UtilService,
    private router: Router,
    private dialog: MatDialog,
    private locstorage: LocalstorageService,
    private http: HttpClient,
    public datePipe: DatePipe,
    private felicityproducts: FelicityProductsService,
    private excelservice: ExcelService
  ) {}
  async ngOnInit() {
    await this.util.checkNewUser();
    await this.util.checkFelicity();
    await this.session.checkSession();
    await this.getProducts();
    await this.getInactiveProducts();
  }

  onPageChange(event: any) {
    this.tablepage = Number(event?.pageIndex) || 0;
    this.pageSize = Number(event?.pageSize) || 0;
    this.getProducts();
  }
  async getProducts() {
    let search = this.searchFormControl.value || "";
    (
      await this.felicityproducts.getActiveProducts(search, this.item_category)
    ).subscribe((response) => {
      this.dataSource = response;
    });
  }

  async getInactiveProducts() {
    let inactive_search = this.searchInactiveFormControl.value || "";
    (
      await this.felicityproducts.getInactiveProducts(
        inactive_search,
        this.inactive_item_category
      )
    ).subscribe((response) => {
      this.inactiveDataSource = response;
    });
  }

  async exportExcel() {
    let search = this.searchFormControl.value || "";
    this.excelservice.exportExcelFelicitiyProductList(
      search,
      this.item_category
    );
  }
  // async getProducts() {
  //   this.isLoading = true;

  //   const accessToken = await this.locstorage.getData("accessToken");
  //   const options = {
  //     headers: {
  //       authorization: `Bearer ${accessToken}`,
  //     },
  //     params: new HttpParams()
  //       .set("page", this.tablepage)
  //       .set("size", this.pageSize)
  //       .set("query", this.searchFormControl.value || "")
  //       .set("item_category", this.item_category)
  //       .set("active", true)
  //   };

  //   const response = this.http
  //     .get(`${environment.serverAPI}/api/products/felicity/`, options)
  //     .toPromise();
  //   const loadingPromise = new Promise((resolve) =>
  //     setTimeout(resolve, environment.loadingTime)
  //   );

  //   return await Promise.all([response, loadingPromise]).then(
  //     ([response]: any) => {
  //       this.isLoading = false;
  //       this.dataSource = response.data;
  //       this.dataMax = response.totalItems;
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //       this.util.openSnackBar(error.error.message, "OK");
  //     }
  //   );
  // }
  clearSearch() {}
  navigateSettings() {
    this.router.navigate(["settings"], {
      queryParams: {
        view: this.view,
      },
    });
  }

  openAddItemDialog(): void {
    const dialogRef = this.dialog.open(AddFelicityProductDialog);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.AddProduct(result.value);
      }
    });
  }

  async AddProduct(formData: any) {
    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");
    const creator_id = await this.locstorage.getData("id");

    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const form = {
      item_type: formData.item_type,
      item_name: formData.item_name,
      item_category: formData.item_category,
      item_brand: formData.item_brand,
      item_packaging_unit: formData.item_packaging_unit,
      item_quantity_per_unit: formData.item_quantity_per_unit,
      item_unit_measure: formData.item_unit_measure,
      creator_id: creator_id,
    };
    const response = this.http
      .post(`${this.serverAPI}/api/products/felicity/`, form, options)
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      ([response]: any) => {
        if (response) {
          this.isLoading = false;
          this.util.openSnackBar(response.message, "OK");
          this.getProducts();
        }
      },
      (error) => {
        this.isLoading = false;
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }
  viewProduct(id: string) {
    this.router.navigate(["view-felicityproduct"], {
      queryParams: {
        product_id: id,
        view: this.view,
      },
    });
  }
}

@Component({
  selector: "addfelicityproduct-dialog",
  templateUrl:
    "../../components/dialogs/FelicityProduct/add-felicity-product-dialog.html",
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgIf,
    MatCheckboxModule,
    JsonPipe,
    NgFor,
  ],
})
export class AddFelicityProductDialog implements OnInit {
  item_type = [
    { name: "Pork", value: "Pork" },
    { name: "Chicken", value: "Chicken" },
    { name: "Vegetable", value: "Vegetable" },
    { name: "Beef", value: "Beef" },
    { name: "Fruits", value: "Fruits" },
    { name: "Seafood", value: "Seafood" },
    { name: "Industrial", value: "Industrial" },
  ];
  meat = ["Pork", "Chicken", "Vegetable", "Beef", "Seafood"];
  produce = ["Vegetables", "Fruits"];
  industrial = [
    "Breading Mix",
    "Canned Goods",
    "Condiments",
    "Frozen Goods",
    "Industrial",
    "Nuts",
    "Oil",
    "Seasoning",
    "Spices",
    "Dressing",
    "Grains",
  ];
  packaging_unit = [
    "Pack",
    "Bag",
    "Bottle",
    "Can",
    "Box",
    "Sachet",
    "Sack",
    "Jar",
    "Tray",
  ];
  unit_measure = [
    { name: "Milligram", value: "mg" },
    { name: "Gram", value: " g" },
    { name: "Kilogram", value: "kg" },
    { name: "Ounce", value: "oz" },
    { name: "Pound", value: "lb" },
    { name: "Ton", value: "ton" },
    { name: "Gallon", value: "gal" },
    { name: "Pint", value: "pt" },
    { name: "Litre", value: " l" },
    { name: "Millilitre", value: "ml" },
  ];

  addFelicityProductForm = new FormGroup({
    item_type: new FormControl("", Validators.required),
    item_name: new FormControl("", Validators.required),
    item_category: new FormControl("", Validators.required),
    item_brand: new FormControl(""),
    item_packaging_unit: new FormControl(""),
    item_quantity_per_unit: new FormControl(0),
    item_unit_measure: new FormControl(""),
  });
  constructor(
    public dialogRef: MatDialogRef<AddFelicityProductDialog>,
    private _formBuilder: FormBuilder
  ) {}

  async ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onItemTypeChange() {
    var item_type = this.addFelicityProductForm.value.item_type;
    if (
      item_type == "Pork" ||
      item_type == "Chicken" ||
      item_type == "Beef" ||
      item_type == "Seafood"
    ) {
      this.addFelicityProductForm.get("item_category")?.setValue("Meat");
    }
    if (item_type == "Vegetable" || item_type == "Fruits") {
      this.addFelicityProductForm.get("item_category")?.setValue("Produce");
    }
  }
}
