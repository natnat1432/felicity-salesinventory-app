import { JsonPipe, NgFor, NgIf } from "@angular/common";
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
import { MatCheckboxModule } from "@angular/material/checkbox";
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Router } from "@angular/router";
import { SessionService } from "src/app/services/session/session.service";
import { UtilService } from "src/app/services/util/util.service";

@Component({
  selector: "app-felicity-productlist",
  templateUrl: "./felicity-productlist.component.html",
  styleUrls: ["./felicity-productlist.component.css"],
})
export class FelicityProductlistComponent implements OnInit {
  isLoading: boolean = false;
  page: string = "Felicity Product List";
  view: string = "felicity";
  dataSource: any = [];
  searchFormControl = new FormControl("");
  tablepage: number = 0;
  pageSize: number = 5;
  dataMax: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  constructor(
    private session: SessionService,
    private util: UtilService,
    private router: Router,
    private dialog: MatDialog
  ) {}
  async ngOnInit() {
    await this.util.checkNewUser();
    await this.util.checkFelicity();
    await this.session.checkSession();
  }

  onPageChange(event: any) {}

  getItems() {}
  clearSearch() {}
  navigateSettings() {
    this.router.navigate(["settings"]);
  }

  openAddItemDialog(): void {
    const dialogRef = this.dialog.open(AddFelicityProductDialog);

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        console.log(result);
      }
    });
  }
}

@Component({
  selector: "addfelicityproduct-dialog",
  templateUrl: "../../components/dialogs/addfelicityproduct-dialog.html",
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
export class AddFelicityProductDialog implements OnInit {
  item_type = [
    { name: "Pork", value: "P" },
    { name: "Chicken", value: "C" },
    { name: "Vegetable", value: "V" },
    { name: "Beef", value: "B" },
    { name: "Fruits", value: "F" },
    { name: "Seafood", value: "S" },
    { name: "Industrial", value: "I" },
  ];
  meat = ["Pork","Chicken","Vegetable","Beef", "Seafood"]
  produce = ["Vegetables", "Fruits"]
  industrial = [
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
  packaging_unit = [
    "Pack",
    "Bottle",
    "Can",
    "Box",
    "Sachet",
    "Sack",
    "Jar",
    "Tray",
  ];
  unit_measure = [
    { name: "Milligram", value: "mg" },
    { name: "Gram", value: " g" },
    { name: "Kilogram", value: "kg" },
    { name: "Ounce", value: "oz" },
    { name: "Pound", value: "lb" },
    { name: "Ton", value: "ton" },
    { name: "Gallon", value: "gal" },
    { name: "Pint", value: "pt" },
    { name: "Litre", value: " l" },
    { name: "Millilitre", value: "ml" },
  ];

  addFelicityProductForm = new FormGroup({
    item_type:new FormControl("", Validators.required),
    item_name:new FormControl("",Validators.required),
    item_category:new FormControl("",Validators.required),
    item_brand:new FormControl("", Validators.required),
    item_packaging_unit: new FormControl(""),
    item_quantity_per_unit: new FormControl(0),
    item_unit_measure: new FormControl("") 
  })
  constructor(
    public dialogRef: MatDialogRef<AddFelicityProductDialog>,
    private _formBuilder: FormBuilder
  ) {}

  async ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onItemTypeChange(){
    console.log("changed")
    var item_type = this.addFelicityProductForm.value.item_type
    if(item_type == 'P' || item_type == 'C' || item_type == 'B' || item_type == 'S'){
        this.addFelicityProductForm.get('item_category')?.setValue('Meat')
    }
    if(item_type == 'V' || item_type == 'F'){
        this.addFelicityProductForm.get('item_category')?.setValue('Produce')
    }

  }
}
