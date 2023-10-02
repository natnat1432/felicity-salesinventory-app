import { DatePipe, JsonPipe, NgFor, NgIf } from "@angular/common";
import { Component, Inject, OnInit, resolveForwardRef } from "@angular/core";
import { LocalstorageService } from "src/app/services/localstorage/localstorage.service";
import { SessionService } from "src/app/services/session/session.service";
import { UtilService } from "src/app/services/util/util.service";
import { ActivatedRoute, ResolveEnd, Router } from "@angular/router";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/app/environment/environment";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";

@Component({
  selector: "app-view-felicityproduct",
  templateUrl: "./view-felicityproduct.component.html",
  styleUrls: ["./view-felicityproduct.component.css"],
})
export class ViewFelicityproductComponent implements OnInit {
  isLoading: boolean = false;
  page: string = "View Product";
  view: string = "";
  serverAPI: string = environment.serverAPI;
  product_data: any;
  product_id: any;
  productLoggingData: any;
  userCategory:any;
  constructor(
    private router: Router,
    public datePipe: DatePipe,
    private session: SessionService,
    private locstorage: LocalstorageService,
    private util: UtilService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.view = params["view"];
      this.product_id = params["product_id"];
    });
  }
  async ngOnInit() {
    await this.util.checkNewUser();
    await this.session.checkSession();

    await this.getProduct();
    await this.getProductLoggingData();
    this.userCategory = await this.locstorage.getData("user_category")
  }

  async getProduct() {
    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    const response = this.http
      .get(
        `${this.serverAPI}/api/products/felicity/find/${this.product_id}`,
        options
      )
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      ([response]: any) => {
        this.isLoading = false;
        this.product_data = response;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }
  async getProductLoggingData() {
    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    const response = this.http
      .get(
        `${this.serverAPI}/api/products/felicity/logs/${this.product_data.id}`,
        options
      )
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      ([response]: any) => {
        this.isLoading = false;
        this.productLoggingData = response;
      },
      (error) => {
        this.isLoading = false;
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }
  navigateProducts() {
    this.router.navigate(["felicity-productlist"], {
      queryParams: {
        view: this.view,
      },
    });
  }
  openEditProductDialog(): void {
    const dialogRef = this.dialog.open(EditFelicityProductDialog, {
      data: {
        product_data: this.product_data,
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        var changes = [];
        let form: any = {};
        for (let each in result.changes) {
          if (result.changes[each] != "") {
            changes.push(result.changes[each]);
            form[`${each}`] = result.editFelicityProductForm[each];
          }
        }
        result.changes = changes;
        result.editFelicityProductForm = form;
        await this.updateProduct(result);
      }
    });
  }

  async updateProduct(form: any) {
    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");
    const creator_id = await this.locstorage.getData("id");

    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      params: new HttpParams().set("creator_id", `${creator_id}`),
    };

    //Add Supplier id and code to the form
    form.editFelicityProductForm["id"] = this.product_data.id;
    form.editFelicityProductForm["code"] = this.product_data.code;

    const response = this.http
      .put(
        `${this.serverAPI}/api/products/felicity/${this.product_data.id}`,
        form,
        options
      )
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      async ([response]: any) => {
        this.isLoading = false;
        if (response.message) {
          this.util.openSnackBar(response.message, "OK");
          await this.getProduct();
          await this.getProductLoggingData();
        }
      },
      (error) => {
        this.isLoading = false;
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }

  async updateProductVisibility() {
    this.isLoading = true;
    this.product_data.active = !this.product_data.active;

    const accessToken = await this.locstorage.getData("accessToken");
    const creator_id = await this.locstorage.getData("id");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      params: new HttpParams().set("creator_id", `${creator_id}`),
    };
    const form = {
      product_form: {
        item_code: this.product_data.item_code,
        item_name: this.product_data.item_name,
        active: this.product_data.active,
      },
      changes: {
        description: [
          `Product active from "${!this.product_data.active}" to "${
            this.product_data.active
          }"`,
        ],
      },
    };

    const response = this.http
      .put(
        `${this.serverAPI}/api/products/felicity/status/${this.product_data.id}`,
        form,
        options
      )
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      async ([response]: any) => {
        this.isLoading = false;
        if (response.message) {
          this.util.openSnackBar(response.message, "OK");
        }
        await this.getProduct();
      },
      (error) => {
        this.isLoading = false;
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }
}

@Component({
  selector: "editfelicityproduct-dialog",
  templateUrl:
    "../../components/dialogs/FelicityProduct/edit-felicity-product-dialog.html",
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
export class EditFelicityProductDialog implements OnInit {
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
  editFelicityProductForm = new FormGroup({
    id: new FormControl("", Validators.required),
    item_code: new FormControl("", Validators.required),
    item_type: new FormControl("", Validators.required),
    item_name: new FormControl("", Validators.required),
    item_category: new FormControl("", Validators.required),
    item_brand: new FormControl("", Validators.required),
    item_packaging_unit: new FormControl(""),
    item_quantity_per_unit: new FormControl(0),
    item_unit_measure: new FormControl(""),
  });
  intialProductValues: any;
  editProductChanges = {
    id: "",
    item_code: "",
    item_type: "",
    item_name: "",
    item_category: "",
    item_brand: "",
    item_packaging_unit: "",
    item_quantity_per_unit: "",
    item_unit_measure: "",
  };
  constructor(
    public dialogRef: MatDialogRef<EditFelicityProductDialog>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngOnInit() {
    if (this.data.product_data) {
      this.editFelicityProductForm.setValue({
        id: this.data.product_data.id,
        item_code: this.data.product_data.item_code,
        item_type: this.data.product_data.item_type,
        item_name: this.data.product_data.item_name,
        item_category: this.data.product_data.item_category,
        item_brand: this.data.product_data.item_brand,
        item_packaging_unit: this.data.product_data.item_packaging_unit,
        item_quantity_per_unit: this.data.product_data.item_quantity_per_unit,
        item_unit_measure: this.data.product_data.item_unit_measure,
      });
      this.intialProductValues = this.editFelicityProductForm.value;
    }
    this.onChanges();
  }

  onChanges() {
    this.editFelicityProductForm.valueChanges.subscribe((value) => {
      this.editProductChanges.item_type =
        value["item_type"] != this.intialProductValues["item_type"]
          ? `Product type: "${this.intialProductValues["item_type"]}" to "${value["item_type"]}"`
          : "";
      this.editProductChanges.item_name =
        value["item_name"] != this.intialProductValues["item_name"]
          ? `Product name: "${this.intialProductValues["item_name"]}" to "${value["item_name"]}"`
          : "";
      this.editProductChanges.item_category =
        value["item_category"] != this.intialProductValues["item_category"]
          ? `Product Category: "${this.intialProductValues["item_category"]}" to "${value["item_category"]}"`
          : "";
      this.editProductChanges.item_brand =
        value["item_brand"] != this.intialProductValues["item_brand"]
          ? `Product brand: "${this.intialProductValues["item_brand"]}" to "${value["item_brand"]}"`
          : "";
      this.editProductChanges.item_packaging_unit =
        value["item_packaging_unit"] !=
        this.intialProductValues["item_packaging_unit"]
          ? `Product packaging unit: "${this.intialProductValues["item_packaging_unit"]}" to "${value["item_packaging_unit"]}"`
          : "";
      this.editProductChanges.item_quantity_per_unit =
        value["item_quantity_per_unit"] !=
        this.intialProductValues["item_quantity_per_unit"]
          ? `Product quantity per unit: "${this.intialProductValues["item_quantity_per_unit"]}" to "${value["item_quantity_per_unit"]}"`
          : "";
      this.editProductChanges.item_unit_measure =
        value["item_unit_measure"] !=
        this.intialProductValues["item_unit_measure"]
          ? `Product unit measure: "${this.intialProductValues["item_unit_measure"]}" to "${value["item_unit_measure"]}"`
          : "";
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onProductTypeChange() {
    var item_type = this.editFelicityProductForm.value.item_type;
    if (
      item_type == "Pork" ||
      item_type == "Chicken" ||
      item_type == "Beef" ||
      item_type == "Seafood"
    ) {
      this.editFelicityProductForm.get("item_category")?.setValue("Meat");
    }
    if (item_type == "Vegetable" || item_type == "Fruits") {
      this.editFelicityProductForm.get("item_category")?.setValue("Produce");
    }
  }
}
