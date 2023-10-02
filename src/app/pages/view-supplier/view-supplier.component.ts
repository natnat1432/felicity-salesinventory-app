import { DatePipe, JsonPipe, NgFor, NgIf } from "@angular/common";
import { Component, Inject, OnInit, resolveForwardRef } from "@angular/core";
import { LocalstorageService } from "src/app/services/localstorage/localstorage.service";
import { SessionService } from "src/app/services/session/session.service";
import { UtilService } from "src/app/services/util/util.service";
import { ActivatedRoute, Router } from "@angular/router";
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

@Component({
  selector: "app-view-supplier",
  templateUrl: "./view-supplier.component.html",
  styleUrls: ["./view-supplier.component.css"],
})
export class ViewSupplierComponent implements OnInit {
  isLoading: boolean = false;
  page: string = "View Supplier";
  view: string = "felicity";
  supplier_data: any;
  supplier_id: any;
  supplierLoggingData: any;
  serverAPI: string = environment.serverAPI;
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
      this.supplier_id = params["supplier_id"];
    });
  }

  async ngOnInit() {
    await this.util.checkNewUser();
    await this.session.checkSession();

    await this.getSupplier();
    await this.getSupplierLoggingData();
  }

  navigateSuppliers() {
    this.router.navigate(["felicity-supplierlist"], {
      queryParams: {
        view: this.view,
      },
    });
  }
  async getSupplier() {
    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    const response = this.http
      .get(`${this.serverAPI}/api/suppliers/find/${this.supplier_id}`, options)
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      ([response]: any) => {
        this.isLoading = false;
        this.supplier_data = response;
      },
      (error) => {
        this.isLoading = false;
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }

  openDeleteSupplierDialog(): void {
    const dialogRef = this.dialog.open(DeleteSupplierDialog);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.deleteSupplier();
      }
    });
  }
  openEditSupplierDialog(): void {
    const dialogRef = this.dialog.open(EditFelicitySupplierDialog, {
      data: {
        category: this.categoryOptions,
        supplier_data: this.supplier_data,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        var changes = [];
        let form: any = {};
        for (let each in result.changes) {
          if (result.changes[each] != "") {
            changes.push(result.changes[each]);
            form[`${each}`] = result.editSupplier[each];
          }
        }
        result.changes = changes;
        result.editSupplier = form;

        await this.updateSupplier(result);
      }
    });
  }
  async deleteSupplier() {
    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const response = this.http
      .delete(`${this.serverAPI}/api/suppliers/${this.supplier_id}`, options)
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      ([response]: any) => {
        if (response) {
          this.isLoading = false;
          this.util.openSnackBar(response.message, "OK");
          this.navigateSuppliers();
        }
      },
      (error) => {
        this.isLoading = false;
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }
  async updateSupplier(formData: any) {
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
    formData.editSupplier["id"] = this.supplier_data.id;
    formData.editSupplier["code"] = this.supplier_data.code;
    const response = this.http
      .put(
        `${this.serverAPI}/api/suppliers/${this.supplier_data.id}`,
        formData,
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
          await this.getSupplier();
          await this.getSupplierLoggingData();
        }
      },
      (error) => {
        this.isLoading = false;
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }

  async getSupplierLoggingData() {
    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    const response = this.http
      .get(
        `${this.serverAPI}/api/suppliers/logs/${this.supplier_data.id}`,
        options
      )
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      ([response]: any) => {
        this.isLoading = false;
        this.supplierLoggingData = response;
      },
      (error) => {
        this.isLoading = false;
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }
}
@Component({
  selector: "deletesupplier-dialog",
  templateUrl:
    "../../components/dialogs/FelicitySupplier/delete-supplier-dialog.html",
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DeleteSupplierDialog {
  constructor(public dialogRef: MatDialogRef<DeleteSupplierDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: "editfelicitysupplier-dialog",
  templateUrl:
    "../../components/dialogs/FelicitySupplier/edit-felicity-supplier-dialog.html",
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
export class EditFelicitySupplierDialog implements OnInit {
  editSupplier = new FormGroup({
    registered_name: new FormControl("", Validators.required),
    landline: new FormControl("", Validators.required),
    business_address: new FormControl("", Validators.required),
    contact_person: new FormControl("", Validators.required),
    contact_person_mobile: new FormControl("", Validators.required),
    supply_category: new FormControl("", Validators.required),
  });
  editChanges = {
    registered_name: "",
    landline: "",
    business_address: "",
    contact_person: "",
    contact_person_mobile: "",
    supply_category: "",
  };
  intialSupplierValues: any;
  constructor(
    public dialogRef: MatDialogRef<EditFelicitySupplierDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder
  ) {}

  async ngOnInit() {
    if (this.data.supplier_data) {
      this.editSupplier.setValue({
        registered_name: this.data.supplier_data.registered_name,
        landline: this.data.supplier_data.landline,
        business_address: this.data.supplier_data.business_address,
        contact_person: this.data.supplier_data.contact_person,
        contact_person_mobile: this.data.supplier_data.contact_person_mobile,
        supply_category: this.data.supplier_data.supply_category,
      });
      this.intialSupplierValues = this.editSupplier.value;
    }
    this.onChanges();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onChanges(): void {
    this.editSupplier.valueChanges.subscribe((value) => {
      this.editChanges.registered_name =
        value["registered_name"] != this.intialSupplierValues["registered_name"]
          ? `Registered name: "${this.intialSupplierValues["registered_name"]}" to "${value["registered_name"]}"`
          : "";
      this.editChanges.landline =
        value["landline"] != this.intialSupplierValues["landline"]
          ? `Landline: "${this.intialSupplierValues["landline"]}" to "${value["landline"]}"`
          : "";
      this.editChanges.business_address =
        value["business_address"] !=
        this.intialSupplierValues["business_address"]
          ? `Business Address: "${this.intialSupplierValues["business_address"]}" to "${value["business_address"]}"`
          : "";
      this.editChanges.contact_person =
        value["contact_person"] != this.intialSupplierValues["contact_person"]
          ? `Contact Person: "${this.intialSupplierValues["contact_person"]}" to "${value["contact_person"]}"`
          : "";
      this.editChanges.contact_person_mobile =
        value["contact_person_mobile"] !=
        this.intialSupplierValues["contact_person_mobile"]
          ? `Contact Person Mobile: "${this.intialSupplierValues["contact_person_mobile"]}" to "${value["contact_person_mobile"]}"`
          : "";
      this.editChanges.supply_category =
        value["supply_category"] != this.intialSupplierValues["supply_category"]
          ? `Supply Category: "${this.intialSupplierValues["supply_category"]}" to "${value["supply_category"]}"`
          : "";
    });
  }
}
