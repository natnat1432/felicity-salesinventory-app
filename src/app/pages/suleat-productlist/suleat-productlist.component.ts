import { NgFor, NgIf } from "@angular/common";
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
import { SuleatProductsService } from "src/app/services/http/suleat-products/suleat-products.service";
import { SessionService } from "src/app/services/session/session.service";
import { UtilService } from "src/app/services/util/util.service";

@Component({
  selector: "app-suleat-productlist",
  templateUrl: "./suleat-productlist.component.html",
  styleUrls: ["./suleat-productlist.component.css"],
})
export class SuleatProductlistComponent implements OnInit {
  isLoading: boolean = false;
  page: string = "Suleat Product List";
  view: string = "suleat";
  searchFormControl = new FormControl("");
  searchInactiveFormControl = new FormControl("");

  item_category: any = "All";
  inactive_item_category: any = "All";
  item_category_options: string[] = ["All", "Packed Meal", "Food Tray"];
  displayedColumns: string[] = [
    "ItemCode",
    "ItemName",
    "ItemCategory",
    "PackagingUnit",
    "UnitofMeasure",
    "Actions",
  ];
  dataSource: any;
  inactiveDataSource: any;

  constructor(
    private session: SessionService,
    private util: UtilService,
    private router: Router,
    public dialog: MatDialog,
    private suleatproducts: SuleatProductsService,
    private excelservice: ExcelService
  ) {}
  async ngOnInit() {
    await this.util.checkNewUser();
    await this.util.checkSuleat();
    await this.session.checkSession();
    await this.getProducts();
  }

  navigateSettings() {
    this.router.navigate([`suleat-settings`], {
      queryParams: {
        view: this.view,
      },
    });
  }
  openAddItemDialog(): void {
    const dialogRef = this.dialog.open(AddSuleatProductDialog);

    dialogRef.afterClosed().subscribe(async (value) => {
      if (value) {
        dialogRef.close();
        this.dialog.closeAll();
        await this.addProduct(value);
      }
    });
  }
  viewProduct(id: number) {
    this.router.navigate([`view-suleatproduct`], {
      queryParams: {
        view: this.view,
        product_id: id,
      },
    });
  }

  async addProduct(formData: any) {
    this.isLoading = true;
    const response = (
      await this.suleatproducts.addSuleatProduct(formData)
    ).toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      async (response: any) => {
        this.isLoading = false;
        if (response[0].message) {
          this.util.openSnackBar(response[0].message, "OK");
          await this.getProducts();
        }
      },
      (error) => {
        this.isLoading = false;
        if (error.error.message) {
          this.util.openSnackBar(error.error.message, "OK");
        }
      }
    );
  }
  async getProducts() {
    let search = this.searchFormControl.value || "";
    (
      await this.suleatproducts.getActiveProducts(search, this.item_category)
    ).subscribe((response) => {
      this.dataSource = response;
    });
  }

  async getInactiveProducts() {
    let inactive_search = this.searchInactiveFormControl.value || "";
    (
      await this.suleatproducts.getInactiveProducts(
        inactive_search,
        this.inactive_item_category
      )
    ).subscribe((response) => {
      this.inactiveDataSource = response;
    });
  }
  exportExcel() {
    let search = this.searchFormControl.value || "";
    this.excelservice.exportExcelSuleatProductList(search, this.item_category);
  }
}

@Component({
  selector: "addsuleatproduct-dialog",
  templateUrl:
    "../../components/dialogs/SuleatProduct/add-suleat-product-dialog.html",
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
    NgFor,
  ],
})
export class AddSuleatProductDialog implements OnInit {
  item_category_options: string[] = ["Packed Meal", "Food Tray"];
  packaging_unit_options: string[] = ["Pack", "Tray"];
  unit_measure_options: string[] = [
    "Pack",
    "Small Tray",
    "Medium Tray",
    "Large Tray",
  ];

  addSuleatProductForm = new FormGroup({
    item_name: new FormControl("", Validators.required),
    item_category: new FormControl("", Validators.required),
    item_packaging_unit: new FormControl(""),
    item_unit_measure: new FormControl(""),
  });
  constructor(
    public dialogRef: MatDialogRef<AddSuleatProductDialog>,
    private _formBuilder: FormBuilder
  ) {}

  async ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
