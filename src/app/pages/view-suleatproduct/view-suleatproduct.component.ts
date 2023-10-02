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
import { SuleatProductsService } from "src/app/services/http/suleat-products/suleat-products.service";

@Component({
  selector: "app-view-suleatproduct",
  templateUrl: "./view-suleatproduct.component.html",
  styleUrls: ["./view-suleatproduct.component.css"],
})
export class ViewSuleatproductComponent implements OnInit {
  isLoading: boolean = false;
  page: string = "View Suleat Product";
  view: string = "";
  serverAPI: string = environment.serverAPI;
  product_data: any;
  userCategory:any;
  product_id: any;
  productLoggingData: any;
  constructor(
    private router: Router,
    public datePipe: DatePipe,
    private session: SessionService,
    private locstorage: LocalstorageService,
    private util: UtilService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private suleatproduct: SuleatProductsService
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
    await this.getProductLogs();
    this.userCategory = await this.locstorage.getData("user_category")
  }

  async getProduct() {
    (await this.suleatproduct.getProduct(this.product_id)).subscribe(
      (response) => {
        this.product_data = response;
      },
      (error) => {
        if (error.error) {
          this.util.openSnackBar(error.error.message, "OK");
        }
      }
    );
  }

  async getProductLogs() {
    (await this.suleatproduct.getProductLogs(this.product_id)).subscribe(
      (response) => {
        if (response) {
          this.productLoggingData = response;
        }
      },
      (error) => {
        if (error.error) {
          this.util.openSnackBar(error.error.message, "OK");
        }
      }
    );
  }
  navigateProducts() {
    this.router.navigate(["suleat-productlist"], {
      queryParams: {
        view: this.view,
      },
    });
  }

  async openEditProductDialog() {
    const dialogRef = this.dialog.open(EditSuleatProductDialog, {
      data: { product_data: this.product_data },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        var changes = [];
        let form: any = {};
        for (let each in result.changes) {
          if (result.changes[each] != "") {
            changes.push(result.changes[each]);
            form[`${each}`] = result.editSuleatProductForm[each];
          }
        }
        result.changes = changes;
        result.editSuleatProductForm = form;
        console.log(result);
        await this.updateProduct(result);
      }
    });
  }
  async updateProduct(form: any) {
    this.isLoading = true;

    //Add Supplier id and code to the form
    form.editSuleatProductForm["id"] = this.product_data.id;
    form.editSuleatProductForm["code"] = this.product_data.item_code;

    const response = (
      await this.suleatproduct.updateProduct(this.product_id, form)
    ).toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      async ([response]: any) => {
        this.isLoading = false;
        if (response.message) {
          this.util.openSnackBar(response.message, "OK");
          await this.getProduct();
          await this.getProductLogs();
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
    const form = {
      product_form: {
        item_code: this.product_data.item_code,
        item_name: this.product_data.item_name,
        active: this.product_data.active,
      },
      changes: {
        description: [
          `Product visibility from "${!this.product_data.active}" to "${
            this.product_data.active
          }"`,
        ],
      },
    };
    const response = (
      await this.suleatproduct.updateProductVisibility(this.product_id, form)
    ).toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      async ([response]: any) => {
        this.isLoading = false;
        console.log(response);
        this.util.openSnackBar(response.message, "OK");
        await this.getProduct();
        await this.getProductLogs();
      },
      (error) => {
        if (error.error) {
          this.isLoading = false;
          this.util.openSnackBar(error.error.message, "OK");
        }
      }
    );
  }
}

@Component({
  selector: "editsuleatproduct-dialog",
  templateUrl:
    "../../components/dialogs/SuleatProduct/edit-suleat-product-dialog.html",
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
export class EditSuleatProductDialog implements OnInit {
  item_category_options: string[] = ["Packed Meal", "Food Tray"];
  packaging_unit_options: string[] = ["Pack", "Tray"];
  unit_measure_options: string[] = [
    "Pack",
    "Small Tray",
    "Medium Tray",
    "Large Tray",
  ];

  editSuleatProductForm = new FormGroup({
    id: new FormControl("", Validators.required),
    item_code: new FormControl("", Validators.required),
    item_name: new FormControl("", Validators.required),
    item_category: new FormControl("", Validators.required),
    item_packaging_unit: new FormControl(""),
    item_unit_measure: new FormControl(""),
  });
  intialProductValues: any;
  editProductChanges = {
    id: "",
    item_code: "",
    item_name: "",
    item_category: "",
    item_packaging_unit: "",
    item_unit_measure: "",
  };
  constructor(
    public dialogRef: MatDialogRef<EditSuleatProductDialog>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngOnInit() {
    if (this.data.product_data) {
      this.editSuleatProductForm.setValue({
        id: this.data.product_data.id,
        item_code: this.data.product_data.item_code,
        item_name: this.data.product_data.item_name,
        item_category: this.data.product_data.item_category,
        item_packaging_unit: this.data.product_data.item_packaging_unit,
        item_unit_measure: this.data.product_data.item_unit_measure,
      });
      this.intialProductValues = this.editSuleatProductForm.value;
    }
    this.onChanges();
  }

  onChanges() {
    this.editSuleatProductForm.valueChanges.subscribe((value) => {
      this.editProductChanges.item_name =
        value["item_name"] != this.intialProductValues["item_name"]
          ? `Product name: "${this.intialProductValues["item_name"]}" to "${value["item_name"]}"`
          : "";
      this.editProductChanges.item_category =
        value["item_category"] != this.intialProductValues["item_category"]
          ? `Product Category: "${this.intialProductValues["item_category"]}" to "${value["item_category"]}"`
          : "";

      this.editProductChanges.item_packaging_unit =
        value["item_packaging_unit"] !=
        this.intialProductValues["item_packaging_unit"]
          ? `Product packaging unit: "${this.intialProductValues["item_packaging_unit"]}" to "${value["item_packaging_unit"]}"`
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
}
