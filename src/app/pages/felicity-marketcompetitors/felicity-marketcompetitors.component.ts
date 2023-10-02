import { DatePipe, JsonPipe, NgFor, NgIf } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
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
import { Router } from "@angular/router";
import { environment } from "src/app/environment/environment";
import { LocalstorageService } from "src/app/services/localstorage/localstorage.service";
import { SessionService } from "src/app/services/session/session.service";
import { UtilService } from "src/app/services/util/util.service";

@Component({
  selector: "app-felicity-marketcompetitors",
  templateUrl: "./felicity-marketcompetitors.component.html",
  styleUrls: ["./felicity-marketcompetitors.component.css"],
})
export class FelicityMarketcompetitorsComponent implements OnInit {
  isLoading: boolean = false;
  page: string = "Felicity Market Competitors List";
  view: string = "felicity";
  dataSource: any;
  displayedColumns: string[] = ["market_name", "createdBy", "actions"];
  serverAPI: string = environment.serverAPI;
  constructor(
    private session: SessionService,
    private util: UtilService,
    private router: Router,
    private locstorage: LocalstorageService,
    private http: HttpClient,
    public datePipe: DatePipe,
    public dialog: MatDialog
  ) {}
  async ngOnInit() {
    await this.session.checkSession();
    await this.util.checkNewUser();
    await this.util.checkFelicity();
    await this.getCompetitor();
  }

  navigatePriceList() {
    this.router.navigate(["felicity-pricelist"], {
      queryParams: {
        view: this.view,
      },
    });
  }

  openAddCompetitorDialog(): void {
    const dialogRef = this.dialog.open(AddFelicityMarketCompetitorDialog);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.addCompetitors(result.value);
      }
    });
  }
  async getCompetitor() {
    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    const response = this.http
      .get(`${this.serverAPI}/api/products/felicity/competitors/`, options)
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
  async addCompetitors(formData: any) {
    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");
    const creator_id = await this.locstorage.getData("id");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    formData["creator_id"] = creator_id;

    const response = this.http
      .post(
        `${this.serverAPI}/api/products/felicity/competitors/`,
        formData,
        options
      )
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      async ([response]: any) => {
        if (response.message) {
          this.isLoading = false;
          this.util.openSnackBar(response.message, "OK");
          await this.getCompetitor();
        }
      },
      (error) => {
        this.isLoading = false;
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }

  openEditCompetitorDialog(data: any): void {
    const dialogRef = this.dialog.open(EditFelicityMarketCompetitorDialog, {
      data: {
        editFelicityMarketCompetitorForm: data,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.updateCompetitor(result.value);
      }
    });
  }

  async updateCompetitor(form: any) {
    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    const response = this.http
      .put(
        `${this.serverAPI}/api/products/felicity/competitors/${form.id}`,
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
          await this.getCompetitor();
        }
      },
      (error) => {
        this.isLoading = false;
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }

  openDeleteCompetitorDialog(id: string): void {
    const dialogRef = this.dialog.open(DeleteFelicityMarketCompetitorDialog, {
      data: {
        id: id,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.deleteCompetitor(result);
      }
    });
  }

  async deleteCompetitor(id: number) {
    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    const response = this.http
      .delete(
        `${this.serverAPI}/api/products/felicity/competitors/${id}`,
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
          await this.getCompetitor();
        }
      },
      (error) => {
        this.isLoading = false;
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }
}

@Component({
  selector: "addfelicitycompetitor-dialog",
  templateUrl:
    "../../components/dialogs/FelicityMarketCompetitor/add-felicity-marketcompetitor-dialog.html",
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
  ],
})
export class AddFelicityMarketCompetitorDialog implements OnInit {
  addFelicityMarketCompetitor = new FormGroup({
    market_name: new FormControl("", Validators.required),
  });
  constructor(
    public dialogRef: MatDialogRef<AddFelicityMarketCompetitorDialog>
  ) {}

  async ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: "editfelicitycompetitor-dialog",
  templateUrl:
    "../../components/dialogs/FelicityMarketCompetitor/edit-felicity-marketcompetitor-dialog.html",
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
  ],
})
export class EditFelicityMarketCompetitorDialog implements OnInit {
  editFelicityMarketCompetitor = new FormGroup({
    id: new FormControl("", Validators.required),
    market_name: new FormControl("", Validators.required),
  });
  constructor(
    public dialogRef: MatDialogRef<EditFelicityMarketCompetitorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngOnInit() {
    if (this.data.editFelicityMarketCompetitorForm) {
      this.editFelicityMarketCompetitor.patchValue({
        id: this.data.editFelicityMarketCompetitorForm.id,
        market_name: this.data.editFelicityMarketCompetitorForm.market_name,
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: "deletefelicitymarketcompetitor-dialog",
  templateUrl:
    "../../components/dialogs/FelicityMarketCompetitor/delete-felicity-marketcompetitor-dialog.html",
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DeleteFelicityMarketCompetitorDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<EditFelicityMarketCompetitorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
