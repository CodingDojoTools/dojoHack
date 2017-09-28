import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpService } from '../http.service';
import { CountdownService } from '../countdown.service';
import { Team } from '../models';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  admin: boolean;
  location: string;
  logoutMsg: string;
  logForm: FormGroup;
  logFormChanges: Subscription;
  tLen: boolean;
  tLenMax: boolean;
  tReq: boolean;
  placeholderText: string;
  pReq: boolean;
  tDanger: boolean;
  loginError: boolean;
  serverError: boolean;



  constructor(private fb: FormBuilder, private httpService: HttpService, private _router: Router, private count: CountdownService, private _loc: Location) {}

  ngOnInit() {
    this.location = this._loc.path();
    if(this.location == "/register/admin"){
      this.admin = true;
      this.placeholderText = "Admin username";
    }
    else {
      this.admin = false;
      this.placeholderText = "Team name";
    }
    
    this.logoutMsg = this.count.logoutMsg;

    this.logForm = this.fb.group({
      teamName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]],
      password: ['', [Validators.required]]
    })
    
    this.logFormChanges = this.logForm.valueChanges.subscribe(data => {
      this.loginError = false;
      this.serverError = false;
      this.logoutMsg = null;
    })

  }

  loggingIn() {
    this.loginError = false;
    this.serverError = false;
    const model = this.logForm.value;
    if(this.logForm.status == "VALID"){
      let login = {name: "", password: ""};
      login.name = model.teamName;
      login.password = model.password;
      if(this.admin){
        this.httpService.postObs('/login/admin', login).subscribe(
          data => {
            console.log("Loggin in admin", data)
            this._router.navigate(['/dashboard', 'admin'])
          },
          err => {
            console.log("logging in admin error", err)
            if(err.status == 409){
              this.loginError = true;
            }
            else {
              this.serverError = true;
            }
          }
        )
      }
      else {

        this.httpService.postObs('/login', login).subscribe(
          data => {
            console.log("navigating to team dashboard")
            this._router.navigate(['/dashboard'])
          },
          err => {
            console.log("error", err);
            if(err.status == 409){
              this.loginError = true;
            }
            else {
              this.serverError = true;
            }
          }
        )
      }
    }
      
  
  }


  get teamName() {
    let newTeam = this.logForm.get('teamName');
    let TError = newTeam.errors ? newTeam.errors : {};

    this.tLen = TError["minlength"] && newTeam["touched"];
    this.tLenMax = TError["maxlength"];
    this.tReq = TError["required"] && newTeam["touched"];
    this.tDanger = this.tLen || this.tReq || this.tLenMax || this.loginError;

    return newTeam;
  }

  ngOnDestroy(){
    this.count.logoutMsg = null;
    this.logFormChanges.unsubscribe();
  }

}
