import { JsonPipe, NgFor, NgIf } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Router } from "@angular/router";
import { environment } from "src/app/environment/environment";
import { LocalstorageService } from "src/app/services/localstorage/localstorage.service";
import { SessionService } from "src/app/services/session/session.service";
import { UtilService } from "src/app/services/util/util.service";
@Component({
  selector: "app-felicity-supplierlist",
  templateUrl: "./felicity-supplierlist.component.html",
  styleUrls: ["./felicity-supplierlist.component.css"],
})
export class FelicitySupplierlistComponent implements OnInit {
  isLoading: boolean = false;
  page: string = "Felicity Supplier List";
  view: string = "felicity";
  serverAPI = environment.serverAPI;
  category: string = "All";
  tableSupplierType: string = "";
  tablepage: number = 0;
  pageSize: number = 5;
  dataMax: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  dataSource: any;
  displayedColumns: string[] = [
    "supplier_code",
    "registered_name",
    "landline",
    "address",
    "contact_person",
    "contact_person_mobile",
    "supply_category",
    "actions",
  ];
  categoryOptions: string[] = [
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
  searchFormControl = new FormControl("");
  constructor(
    private session: SessionService,
    private locstorage: LocalstorageService,
    private router: Router,
    public dialog: MatDialog,
    private http: HttpClient,
    private util: UtilService
  ) {}

  async ngOnInit() {
    await this.getSuppliers();
  }

  navigateSettings() {
    this.router.navigate([`settings`], {
      queryParams: {
        view: this.view,
      },
    });
  }

  openAddSupplierDialog(): void {
    const dialogRef = this.dialog.open(AddFelicitySupplierDialog, {
      data: { category: this.categoryOptions },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.addSupplier(result.value);
      }
    });
  }

  async addSupplier(formData: any) {
    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");
    var creator_id = await this.locstorage.getData("id");

    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const form = {
      registered_name: formData.registered_name,
      landline: formData.landline,
      business_address: formData.business_address,
      contact_person: formData.contact_person,
      contact_person_mobile: formData.contact_person_mobile,
      supply_category: formData.supply_category,
      createdBy: creator_id,
    };
    const response = this.http
      .post(`${this.serverAPI}/api/suppliers/`, form, options)
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      ([response]: any) => {
        this.isLoading = false;
        this.util.openSnackBar(response.message, "OK");
        this.getSuppliers();
      },
      (error) => {
        this.isLoading = false;
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
      params: new HttpParams()
        .set("page", this.tablepage)
        .set("size", this.pageSize)
        .set("query", this.searchFormControl.value || "")
        .set("category", this.category),
    };

    const response = this.http
      .get(`${environment.serverAPI}/api/suppliers/`, options)
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      ([response]: any) => {
        this.isLoading = false;
        this.dataSource = response.data;
        this.dataMax = response.totalItems;
      },
      (error) => {
        this.isLoading = false;
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }
  clearSearch() {}
  onPageChange(event: any) {
    this.tablepage = Number(event?.pageIndex) || 0;
    this.pageSize = Number(event?.pageSize) || 0;
    this.getSuppliers();
  }
  viewSupplier(supplier_id: any) {
    this.router.navigate(["view-supplier"], {
      queryParams: {
        view: this.view,
        supplier_id: supplier_id,
      },
    });
  }
}

@Component({
  selector: "addfelicitysupplier-dialog",
  templateUrl:
    "../../components/dialogs/FelicitySupplier/add-felicity-supplier-dialog.html",
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
    JsonPipe,
    NgFor,
  ],
})
export class AddFelicitySupplierDialog implements OnInit {
  newSupplier = new FormGroup({
    registered_name: new FormControl("", Validators.required),
    landline: new FormControl("", Validators.required),
    business_address: new FormControl("", Validators.required),
    contact_person: new FormControl("", Validators.required),
    contact_person_mobile: new FormControl("", Validators.required),
    supply_category: new FormControl("", Validators.required),
  });
  constructor(
    public dialogRef: MatDialogRef<AddFelicitySupplierDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder
  ) {}

  async ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
