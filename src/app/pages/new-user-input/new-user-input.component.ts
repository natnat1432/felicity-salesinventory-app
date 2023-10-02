import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  FormBuilder,
} from "@angular/forms";
import { LocalstorageService } from "src/app/services/localstorage/localstorage.service";
import { SessionService } from "src/app/services/session/session.service";
import { environment } from "src/app/environment/environment";
import { UtilService } from "src/app/services/util/util.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-new-user-input",
  templateUrl: "./new-user-input.component.html",
  styleUrls: ["./new-user-input.component.css"],
})
export class NewUserInputComponent implements OnInit {
  isLoading: boolean = false;
  departments = [
    "Administration Department",
    "Sales Department",
    "Marketing & App Dev Department",
    "Kitchen / R&D Department",
    "Service Delivery Department",
  ];
  isHidePassword: boolean = true;
  isHideConfirmPassword: boolean = true;
  passwordsMatching = false;
  passwordIcon: string = "visibility";
  confirmPasswordIcon: string = "visibility";
  isConfirmPasswordDirty = false;
  firstname: any;
  lastname: any;
  department: any;
  inputfirstname = new FormControl(null, Validators.required);
  inputlastname = new FormControl(null, Validators.required);
  inputdepartment = new FormControl(null, Validators.required);
  newPassword = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    ),
  ]);

  confirmPassword = new FormControl(null, [
    (c: AbstractControl) => Validators.required(c),
    Validators.pattern(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
    ),
  ]);

  newUserForm = this.formBuilder.group(
    {
      firstname: this.inputfirstname,
      lastname: this.inputlastname,
      department: this.inputdepartment,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
    },
    {
      validator: this.ConfirmedValidator("newPassword", "confirmPassword"),
    }
  );

  serverAPI: any = environment.serverAPI;
  constructor(
    private session: SessionService,
    private http: HttpClient,
    private locstorage: LocalstorageService,
    private util: UtilService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}
  async ngOnInit() {
    this.firstname = await this.locstorage.getData("firstname");
    this.lastname = await this.locstorage.getData("lastname");
    this.department = await this.locstorage.getData("department");
    if (
      this.firstname != null &&
      this.lastname != null &&
      this.department != null
    ) {
      this.session.logout();
    }
    await this.session.checkSession();
  }

  async onSubmit() {
    if (!this.newUserForm?.valid) {
      return;
    }

    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");
    const account_id = await this.locstorage.getData("id");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    const userData = {
      firstname: this.newUserForm.value.firstname,
      lastname: this.newUserForm.value.lastname,
      department: this.newUserForm.value.department,
      password: this.newUserForm.value.newPassword,
    };
    const response = this.http
      .put(`${this.serverAPI}/api/accounts/${account_id}`, userData, options)
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      async ([response]: any) => {
        this.isLoading = false;
        if (response.message) {
          await this.util.createLogging(
            `Logged in for the first time and updated his/her info`
          );
          await this.fetchAccountData();
          const system_category = await this.locstorage.getData(
            "system_category"
          );
          if (system_category == "all") {
            this.router.navigate(["login-select"]);
          }
          if (system_category == "felicity") {
            this.router.navigate(["home"]);
          }
          if (system_category == "suleat") {
            this.router.navigate(["suleat-home"]);
          }
        }
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  async fetchAccountData() {
    const accessToken = await this.locstorage.getData("accessToken");
    const account_id = await this.locstorage.getData("id");
    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    this.http
      .get(`${this.serverAPI}/api/accounts/find/${account_id}`, options)
      .subscribe(
        (response: any) => {
          if (response) {
            this.locstorage.saveData("firstname", response.firstname);
            this.locstorage.saveData("lastname", response.lastname);
            this.locstorage.saveData("department", response.department);
          }
        },
        (error) => {}
      );
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors["confirmedValidator"]
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  changePasswordVisibility() {
    this.isHidePassword = !this.isHidePassword;
    if (this.passwordIcon == "visibility") {
      this.passwordIcon = "visibility_off";
    } else {
      this.passwordIcon = "visibility";
    }
  }
  changeConfirmPasswordVisibility() {
    this.isHideConfirmPassword = !this.isHideConfirmPassword;
    if (this.confirmPasswordIcon == "visibility") {
      this.confirmPasswordIcon = "visibility_off";
    } else {
      this.confirmPasswordIcon = "visibility";
    }
  }
}
