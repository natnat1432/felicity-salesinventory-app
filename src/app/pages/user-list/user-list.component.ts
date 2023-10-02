import { Component, OnInit, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { SessionService } from "src/app/services/session/session.service";
import { ErrorStateMatcher } from "@angular/material/core";
import { NgIf } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { LocalstorageService } from "src/app/services/localstorage/localstorage.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/app/environment/environment";
import { UtilService } from "src/app/services/util/util.service";
import { DatePipe } from "@angular/common";
import { JsonPipe } from "@angular/common";
import { Router } from "@angular/router";
import {
  FormControl,
  FormGroupDirective,
  FormGroup,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
} from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
export interface UserElement {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  department: string;
  user_category: string;
  system_category: string;
  active: boolean;
  createdBy: number;
  createdByEmail: string;
  createdAt: Date;
  updatedAt: Date;
}
@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.css"],
})
export class UserListComponent implements OnInit {
  isLoading: boolean = false;
  page: string = "User Management";
  tableUserType: any;
  tableSystemCategory: any;
  tableDepartment: any;
  view: string = "";
  displayedColumns: string[] = [
    "image",
    "email",
    "department",
    "system_category",
    "created_by",
    "created_at",
    "status",
    "actions",
  ];
  dataSource: UserElement[] = [];
  admins: any;
  searchFormControl = new FormControl("");
  tablepage: number = 0;
  pageSize: number = 5;
  dataMax: number = 0;
  tableTab: any;
  userTabs: any;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  public system_category: any;
  public user_category: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private session: SessionService,
    public dialog: MatDialog,
    private locstorage: LocalstorageService,
    private http: HttpClient,
    private util: UtilService,
    public datePipe: DatePipe,
    private router: Router
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.view = params["view"];
    });
  }

  async ngOnInit() {
    await this.util.checkNewUser();
    await this.session.checkSession();
    this.userTabs = await this.locstorage.getData("tabs");
    this.system_category = await this.locstorage.getData("system_category");
    if (this.system_category != "all" && this.system_category != this.view) {
      this.router.navigate(["offlimits"]);
    }
    if (this.system_category == "all") {
      this.system_category = "all-category";
    }
    this.user_category = await this.locstorage.getData("user_category");
    if (this.user_category == "Superadmin") {
      this.tableUserType = "All";
      this.tableTab = "All";
    } else {
      this.tableUserType = "User";
      this.tableTab = this.userTabs[0];
    }
    this.tableDepartment = "All";
    this.tableSystemCategory = this.system_category;
    await this.getUsers();
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialog);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.addUser(result.value);
      }
    });
  }

  async addUser(addUserData: any) {
    const accessToken = await this.locstorage.getData("accessToken");
    const creator_id = await this.locstorage.getData("id");
    var tabs: string[] = [];
    if (addUserData.sales_admin) tabs.push("Sales Admin");
    if (addUserData.production_admin) tabs.push("Production Admin");
    if (addUserData.delivery_admin) tabs.push("Delivery Admin");
    if (addUserData.order_analytics) tabs.push("Order Analytics");

    const checkTab: any = await this.locstorage.getData("tabs");
    if (checkTab.length == 1) {
      tabs.push(checkTab[0]);
    }

    if (tabs.length < 1) {
      this.util.openSnackBar("Assign at least 1 tab to the user", "OK");
    } else {
      const options = {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      };
      const formData = {
        user_category: addUserData.user_category,
        user_system_category:
          addUserData.user_category == "Superadmin"
            ? "all"
            : addUserData.system_category,
        creator_id: creator_id,
        user_email: addUserData.email,
        tabs: tabs,
      };
      this.isLoading = true;
      const response = this.http
        .post(`${environment.serverAPI}/api/accounts/`, formData, options)
        .toPromise();
      const loadingPromise = new Promise((resolve) =>
        setTimeout(resolve, environment.loadingTime)
      );

      return await Promise.all([response, loadingPromise]).then(
        ([response]: any) => {
          this.isLoading = false;

          this.util.openSnackBar(response.message, "OK");

          this.getUsers();
        },
        (error) => {
          this.isLoading = false;
          this.util.openSnackBar(error.error.message, "OK");
        }
      );
    }
  }

  async getUsers() {
    this.isLoading = true;
    var system_category = this.tableSystemCategory;
    if (system_category == "all-category") {
      system_category = null;
    }
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      params: new HttpParams()
        .set("page", this.tablepage)
        .set("size", this.pageSize)
        .set("query", this.searchFormControl.value || "")
        .set("system_category", system_category)
        .set("tabs", this.userTabs.join(","))
        .set("user_type", this.tableUserType)
        .set("department", this.tableDepartment)
        .set("tableTab", this.tableTab),
    };

    const response = this.http
      .get(`${environment.serverAPI}/api/accounts/`, options)
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
  clearSearch() {
    this.searchFormControl.reset();
    this.getUsers();
  }
  onPageChange(event?: PageEvent) {
    this.tablepage = Number(event?.pageIndex) || 0;
    this.pageSize = Number(event?.pageSize) || 0;
    this.getUsers();
  }
  navigateSettings() {
    if (this.view == "felicity") {
      this.router.navigate(["settings"]);
    } else {
      this.router.navigate(["suleat-settings"]);
    }
  }
  viewAccount(account_id: number) {
    this.router.navigate([`view-user`], {
      queryParams: {
        view: this.view,
        account_id: account_id,
      },
    });
  }
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: "adduser-dialog",
  templateUrl: "../../components/dialogs/UserAccount/add-user-dialog.html",
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
  ],
})
export class AddUserDialog implements OnInit {
  confirm: boolean = true;
  addUserForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    user_category: new FormControl(""),
    system_category: new FormControl(""),
    sales_admin: new FormControl(false),
    production_admin: new FormControl(false),
    delivery_admin: new FormControl(false),
    order_analytics: new FormControl(false),
  });

  matcher = new MyErrorStateMatcher();
  user_category: any;
  system_category: any;
  tabs: any;
  constructor(
    public dialogRef: MatDialogRef<AddUserDialog>,
    private locstorage: LocalstorageService,
    private _formBuilder: FormBuilder
  ) {}

  async ngOnInit() {
    this.system_category = await this.locstorage.getData("system_category");
    this.user_category = await this.locstorage.getData("user_category");
    this.tabs = await this.locstorage.getData("tabs");
    if (this.user_category == "Admin") {
      this.addUserForm.patchValue({
        system_category: this.system_category,
      });
      this.addUserForm.get("user_category")?.setValue("User");
    }
    if (this.tabs.length == 1) {
      var tab = this.tabs[0].replace(" ", "_").toLowerCase();
      this.addUserForm.get(tab)?.setValue(true);
      this.addUserForm.get(tab)?.disable();
    }
  }

  onUserCategoryChange(event: any) {
    if (event.value == "Superadmin") {
      this.addUserForm.patchValue({
        sales_admin: true,
        production_admin: true,
        delivery_admin: true,
        order_analytics: true,
        system_category: "all",
      });
    } else {
      this.addUserForm.patchValue({
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
