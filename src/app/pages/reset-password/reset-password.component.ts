import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { LocalstorageService } from "src/app/services/localstorage/localstorage.service";
import { environment } from "src/app/environment/environment";
import { UtilService } from "src/app/services/util/util.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  isLoading: boolean = false;
  serverAPI: string = environment.serverAPI;
  isHidePassword: boolean = true;
  isHideConfirmPassword: boolean = true;
  passwordsMatching = false;
  passwordIcon: string = "visibility";
  confirmPasswordIcon: string = "visibility";
  isConfirmPasswordDirty = false;
  resetPassword: any;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private locstorage: LocalstorageService,
    private util: UtilService,
    private router: Router
  ) {}
  async ngOnInit() {
    this.resetPassword = await this.locstorage.getData("reset_password");
    if (!this.resetPassword) {
      this.router.navigate(["offlimits"]);
    }
  }

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

  resetPasswordForm = this.formBuilder.group(
    {
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
    },
    {
      validator: this.ConfirmedValidator("newPassword", "confirmPassword"),
    }
  );

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
  async onSubmit() {
    this.isLoading = true;
    const accessToken = await this.locstorage.getData("accessToken");
    const id = await this.locstorage.getData("id");

    const options = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const data = {
      password: this.resetPasswordForm.value.newPassword,
      reset_password: false,
    };

    const response = this.http
      .put(`${this.serverAPI}/api/accounts/${id}`, data, options)
      .toPromise();
    const loadingPromise = new Promise((resolve) =>
      setTimeout(resolve, environment.loadingTime)
    );

    return await Promise.all([response, loadingPromise]).then(
      ([response]: any) => {
        if (response.message) {
          this.isLoading = false;
          this.locstorage.saveData("reset_password", false);
          this.util.openSnackBar("Password changed successfully", "OK");
          this.util.redirectUser();
        }
      },
      (error) => {
        this.isLoading = false;
        this.util.openSnackBar(error.error.message, "OK");
      }
    );
  }
}
