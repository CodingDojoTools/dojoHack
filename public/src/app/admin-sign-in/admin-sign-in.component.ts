import { Component, OnInit, trigger, transition, style, animate } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { HttpService } from '../http.service';
import { Admin } from '../models';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


export function comparePassword(group: FormGroup) {
  const pass = group.value;
  return (pass.password === pass.confirmPassword) ? null : { invalid: true }
}

@Component({
  selector: 'app-admin-sign-in',
  templateUrl: './admin-sign-in.component.html',
  styleUrls: ['./admin-sign-in.component.css'],
  animations: [
    trigger(
      'errorAnimation',
      [
        transition(
          ':enter', [
            style({ height: 0, opacity: 0 }),
            animate('300ms', style({ height: 18, opacity: 1 }))
          ]
        ),
        transition(
          ':leave', [
            style({ height: 18, opacity: 1 }),
            animate('300ms', style({ height: 0, opacity: 0 })),
          ]
        )
      ]
    )
  ]
})
export class AdminSignInComponent implements OnInit {

  constructor(private fb: FormBuilder, private httpService: HttpService, private _router: Router) { }

  greyDark: boolean = false;
  locations = [];
  mmDanger: boolean;
  nameDanger: boolean;
  nameMessage: string;
  newAdmin: Admin = new Admin();
  pDanger: boolean;
  permDanger: boolean;
  permissionMessage: string;
  PError: object;
  pLen: boolean;
  pMatch: boolean;
  pR: boolean;
  pValid: boolean = false;
  pwMessage: string;
  regForm: FormGroup;
  regFormChanges: Subscription;
  serverRegError: string;


  ngOnInit() {
    this.regForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]],
      passGroup: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]]
      }, {validator: comparePassword}),
      location: ['', [Validators.required]],
      mattermost: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]],
      permission: ['', [Validators.required]]
    })

    // this.regForm = this.fb.group({
    //   name: ['', []],
    //   passGroup: this.fb.group({
    //     password: ['', []],
    //     confirmPassword: ['', []]
    //   }),
    //   location: ['', []],
    //   mattermost: ['', []],
    //   permission: ['', []]
    // })

    this.getLocations();

    this.regForm.valueChanges.subscribe(
      data => {
        this.nameMessage = null;
        this.permissionMessage = null;
        this.pwMessage = null;
        this.serverRegError = null;
      }
    )
  }


  register() {

    const model = this.regForm.value;
    if (this.regForm.status == "VALID") {
      this.newAdmin.name = model.name;
      this.newAdmin.password = model.passGroup.password;
      this.newAdmin.confirmPassword = model.passGroup.confirmPassword;
      this.newAdmin.location = model.location;
      this.newAdmin.mattermost = model.mattermost;
      this.newAdmin.permission = model.permission;
      
      this.httpService.postObs('/register/admin', this.newAdmin).subscribe(
        data => {
          
          this._router.navigate(['/dashboard/admin'])
        },
        err => {
        
          let knownError = false;
          if (err.message.name) {
            this.nameMessage = err.message.name;
            knownError = true;
          }
          if (err.message.permission) {

            this.permissionMessage = err.message.permission;
            knownError = true;
          }
          if (err.message.password) {
            this.pwMessage = err.message.password;
            knownError = true;
          }
          if(!knownError){
            this.serverRegError = "We could not register you as an admin at this time."
          }
        }
      )
    }
  }


  getLocations() {
    this.httpService.getObs('/locations').subscribe(
      body => this.locations = body['locations'],
      err => console.log("locations error", err)
    )
  }

  greyDarken() {
    this.greyDark = true;
  }

  greyLighten() {
    if (this.mattermost.invalid) {
      this.greyDark = false;
    }
  }




  get passGroup() {
    return this.regForm.get('passGroup');
  }

  get password() {
    let newPass = this.passGroup.get('password');
    this.PError = newPass.errors ? newPass.errors : {};

    this.pLen = this.PError["minlength"] && newPass["touched"];
    this.pR = this.PError["required"] && newPass["touched"];

    this.pDanger = this.pLen || this.pR;

    return newPass;
  }

  get confirmPassword() {
    return this.passGroup.get('confirmPassword')
  }

  get CPDanger() {
    let cp = this.confirmPassword;
    return this.passGroup.invalid && cp.touched;
  }

  get name() {
    let adminName = this.regForm.get('name')
    let nameError = adminName.errors ? adminName.errors : {};
    if ((nameError["required"] || nameError["minlength"]) && adminName["touched"]) {
      this.nameDanger = true;
    }
    else if (nameError["maxlength"]) {
      this.nameDanger = true;
    }
    else {
      this.nameDanger = false;
    }
    return adminName;
  }

  get permission() {
    let perm = this.regForm.get('permission')
    let permError = perm.errors ? perm.errors : {};
    if (permError["required"] && perm.touched) {
      this.permDanger = true;
    }
    else {
      this.permDanger = false;
    }
    return perm
  }

  get mattermost() {
    let mm = this.regForm.get('mattermost');
    let mmError = mm.errors ? mm.errors : {};
    if ((mmError["required"] || mmError["minlength"]) && mm.touched) {
      this.mmDanger = true;
    }
    else if (mmError["maxlength"]) {
      this.mmDanger = true;
    }
    else {
      this.mmDanger = false;
    }
    return mm;
  }



}




