import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalstorageService } from "src/app/services/localstorage/localstorage.service";
import { SessionService } from "src/app/services/session/session.service";
import { environment } from "src/app/environment/environment";
import { HttpClient } from "@angular/common/http";
import { DatePipe, JsonPipe, NgFor, NgIf } from "@angular/common";
import { UtilService } from "src/app/services/util/util.service";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
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

export interface LoggingElement {
  id: number;
  account_id: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: "app-view-user",
  templateUrl: "./view-user.component.html",
  styleUrls: ["./view-user.component.css"],
})
export class ViewUserComponent implements OnInit {
  isLoading: boolean = false;
  page: string = "View User";
  view: string = "";
  account_id: number = 0;
  serverAPI: string = environment.serverAPI;
  user_data!: any;
  displayedColumns: string[] = ["created_at", "description"];
  loggingData: LoggingElement[] = [];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private locstorage: LocalstorageService,
    private session: SessionService,
    private http: HttpClient,
    public datePipe: DatePipe,
    private util: UtilService,
    public dialog: MatDialog
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.view = params["view"];
      this.account_id = params["account_id"];
    });
  }

  async ngOnInit() {
    await this.util.checkNewUser();
    await this.session.checkSession();

    await this.getUser();
    await this.getLoggings();
  }

  navigateUsers() {
    this.router.navigate([`user-list`], {
      queryParams: {
        view: this.view,
      },
    });
  }
  async getUser() {
    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const response = this.http
      .get(`${this.serverAPI}/api/accounts/find/${this.account_id}`, options)
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      (response) => {
        this.isLoading = false;
        if (response[0]) {
          this.user_data = response[0];
          console.log(this.user_data);
        }
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  async getLoggings() {
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    this.isLoading = true;
    const response = this.http
      .get(`${this.serverAPI}/api/loggings/${this.account_id}`, options)
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      ([response]: any) => {
        if (response) {
          this.loggingData = response;
        }

        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }
  openEditUserDialog(): void {
    const dialogRef = this.dialog.open(EditUserDialog, {
      data: this.user_data,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.updateUser(result.value);
      }
    });
  }

  async updateUser(data: any) {
    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");

    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    var tabs: string[] = [];
    if (data.sales_admin) tabs.push("Sales Admin");
    if (data.production_admin) tabs.push("Production Admin");
    if (data.delivery_admin) tabs.push("Delivery Admin");
    if (data.order_analytics) tabs.push("Order Analytics");
    const formData = {
      firstname: data.firstname,
      lastname: data.lastname,
      user_category: data.user_category,
      system_category: data.system_category,
      tabs: tabs,
      department: data.department,
      active: data.active,
    };
    console.log(formData);
    const response = this.http
      .put(
        `${environment.serverAPI}/api/accounts/${this.account_id}`,
        formData,
        options
      )
      .toPromise();

    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      async ([response]: any) => {
        console.log(response);
        if (response.message) {
          this.util.openSnackBar(response.message, "OK");
          await this.util.createLogging(
            `Updated ${data.email}'s account information`
          );
          this.getUser();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openResetPasswordDialog(): void {
    const dialogRef = this.dialog.open(ResetPasswordDialog);

    dialogRef.afterClosed().subscribe(async(result) => {
      if (result) {
        await this.resetPassword()
      }
    });
  }

  async resetPassword() {
    this.isLoading = true
    const accessToken = await this.locstorage.getData("accessToken");
    const creator_id = await this.locstorage.getData("id");

    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const data = {
      creator_id: creator_id,
    };

    const response = this.http
      .put(
        `${this.serverAPI}/api/accounts/resetpassword/${this.account_id}`,
        data,
        options
      )
      .toPromise();

    const loadingPromise = new Promise((resolve)  => setTimeout(resolve, environment.loadingTime))

    return await Promise.all([response,loadingPromise])
        .then(
          ([response]:any)  =>{
            this.isLoading = false
            this.util.openSnackBar(response.message, "OK")
          },
          (error) => {
            this.isLoading = false
            console.log(error)
            this.util.openSnackBar(error.error.message, "OK")
          }
        )
  }
  openDeleteAccountDialog(): void {
    const dialogRef = this.dialog.open(DeleteAccountDialog);

    dialogRef.afterClosed().subscribe(async(result) => {
      if (result) {
        await this.deleteAccount()
      }
    });
  }

  async deleteAccount(){
    this.isLoading = true
    const accessToken = await this.locstorage.getData("accessToken")
    const creator_id = await this.locstorage.getData("id")

    const options = {
      headers:{
        authorization:`Bearer ${accessToken}`
      }
    }

    const data = {
      active:false,
    }
    const response = this.http.put(`${this.serverAPI}/api/accounts/${this.account_id}`, data, options).toPromise()
    const loadingPromise = new Promise((resolve)  =>  setTimeout(resolve,environment.loadingTime))

    return await Promise.all([response,loadingPromise])
      .then(
        ([response]:any) => {
          this.isLoading = false
          if(response.message){
            this.util.openSnackBar("Account deleted successfully", "OK")
            this.util.createLogging(`Deleted an account with an email ${this.user_data.email}`)
            this.navigateUsers()
          }
        },
        (error) =>{
          this.isLoading = false
          console.log(error)
          this.util.openSnackBar(error.error.message, "OK")
        }
      )
  }
}

@Component({
  selector: "edituser-dialog",
  templateUrl: "../../components/dialogs/edituser-dialog.html",
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
export class EditUserDialog implements OnInit {
  confirm: boolean = true;
  departments = [
    "Administration Department",
    "Sales Department",
    "Marketing & App Dev Department",
    "Kitchen / R&D Department",
    "Service Delivery Department",
  ];
  editUserForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    firstname: new FormControl(""),
    lastname: new FormControl(""),
    user_category: new FormControl("", Validators.required),
    system_category: new FormControl("", Validators.required),
    department: new FormControl(""),
    sales_admin: new FormControl(false),
    production_admin: new FormControl(false),
    delivery_admin: new FormControl(false),
    order_analytics: new FormControl(false),
    active: new FormControl(false),
  });

  user_category: any;
  system_category: any;
  tabs: any;
  constructor(
    public dialogRef: MatDialogRef<EditUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private locstorage: LocalstorageService,
    private _formBuilder: FormBuilder
  ) {}

  async ngOnInit() {
    this.system_category = await this.locstorage.getData("system_category");
    this.user_category = await this.locstorage.getData("user_category");
    this.tabs = await this.locstorage.getData("tabs");
    if (this.user_category == "Admin") {
      this.editUserForm.patchValue({
        system_category: this.system_category,
      });
      this.editUserForm.get("user_category")?.setValue("User");
    }
    if (this.tabs.length == 1) {
      var tab = this.tabs[0].replace(" ", "_").toLowerCase();
      this.editUserForm.get(tab)?.setValue(true);
      this.editUserForm.get(tab)?.disable();
    }
    this.editUserForm.get("email")?.setValue(this.data.email);
    this.editUserForm.get("firstname")?.setValue(this.data.firstname);
    this.editUserForm.get("lastname")?.setValue(this.data.lastname);
    this.editUserForm.get("user_category")?.setValue(this.data.user_category);
    this.editUserForm
      .get("system_category")
      ?.setValue(this.data.system_category);
    this.editUserForm.get("department")?.setValue(this.data.department);
    this.editUserForm.get("active")?.setValue(this.data.active);
    for (let tab of this.data.tabs) {
      var each = tab.replace(" ", "_").toLowerCase();
      this.editUserForm.get(each)?.setValue(true);
    }
  }

  onUserCategoryChange(event: any) {
    if (event.value == "Superadmin") {
      this.editUserForm.patchValue({
        sales_admin: true,
        production_admin: true,
        delivery_admin: true,
        order_analytics: true,
        system_category: "all",
      });
    } else {
      this.editUserForm.patchValue({
        sales_admin: false,
        production_admin: false,
        delivery_admin: false,
        order_analytics: false,
        system_category: null,
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: "resetpassword-dialog",
  templateUrl: "../../components/dialogs/resetpassword-dialog.html",
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ResetPasswordDialog {
  constructor(public dialogRef: MatDialogRef<ResetPasswordDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: "deleteaccount-dialog",
  templateUrl: "../../components/dialogs/deleteaccount-dialog.html",
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DeleteAccountDialog {
  constructor(public dialogRef: MatDialogRef<DeleteAccountDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
