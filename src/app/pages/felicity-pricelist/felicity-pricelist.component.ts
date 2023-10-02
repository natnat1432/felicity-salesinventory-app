import { DatePipe, JsonPipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocalstorageService } from "src/app/services/localstorage/localstorage.service";
import { SessionService } from "src/app/services/session/session.service";
import { UtilService } from "src/app/services/util/util.service";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
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
import { NgIf, NgFor } from "@angular/common";
import { environment } from "src/app/environment/environment";

@Component({
  selector: "app-felicity-pricelist",
  templateUrl: "./felicity-pricelist.component.html",
  styleUrls: ["./felicity-pricelist.component.css"],
})
export class FelicityPricelistComponent implements OnInit {
  isLoading: boolean = false;
  page: string = "Felicity Price Effectivity List";
  view: string = "felicity";
  serverAPI: string = environment.serverAPI;
  priceeffectivity_data: any;
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
    await this.util.checkNewUser();
    await this.util.checkFelicity();
    await this.session.checkSession();
    await this.getPriceRanges();
  }

  navigateSettings() {
    this.router.navigate(["settings"]);
  }

  navigateMarketCompetitors() {
    this.router.navigate(["felicity-marketcompetitors"]);
  }

  openAddPriceEffectivity(): void {
    const dialogRef = this.dialog.open(AddFelicityPriceEffectivity);

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        var value = {
          start_effectivity_date: this.util.formatDate(
            result.value.start_effectivity_date
          ),
          end_effectivity_date: this.util.formatDate(
            result.value.end_effectivity_date
          ),
        };

        await this.addPriceEffectivity(value);
      }
    });
  }
  async addPriceEffectivity(formData: any) {
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
        `${this.serverAPI}/api/products/felicity/priceeffecitivity/`,
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
          await this.getPriceRanges();
        }
      },
      (error) => {
        this.isLoading = false;
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }

  async getPriceRanges() {
    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    const response = this.http
      .get(
        `${this.serverAPI}/api/products/felicity/priceeffecitivity/`,
        options
      )
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      ([response]: any) => {
        this.isLoading = false;
        this.priceeffectivity_data = response;
      },
      (error) => {
        this.isLoading = false;
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }
  viewPriceRange(id: string) {
    this.router.navigate(["felicity-pricelistview"], {
      queryParams: {
        id: id,
      },
    });
  }
}

@Component({
  selector: "addfelicitypriceeffectivity-dialog",
  templateUrl:
    "../../components/dialogs/FelicityPriceEffectivity/add-felicity-price-effectivity-dialog.html",
  standalone: true,
  imports: [
    MatDialogModule,
    MatDatepickerModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    NgIf,
    NgFor,
  ],
})
export class AddFelicityPriceEffectivity implements OnInit {
  today = new Date();
  addFelicityPriceEffectivity = new FormGroup({
    start_effectivity_date: new FormControl(
      new Date(
        this.today.getFullYear(),
        this.today.getMonth(),
        this.today.getDate()
      ),
      Validators.required
    ),
    end_effectivity_date: new FormControl(null, Validators.required),
  });
  constructor(public dialogRef: MatDialogRef<AddFelicityPriceEffectivity>) {}

  async ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
