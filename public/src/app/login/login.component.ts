import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { HttpService } from '../http.service';
import { Team } from '../team';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  logForm: FormGroup;
  tLen: Boolean;
  tLenMax: Boolean;
  tReq: Boolean;
  pReq: Boolean;
  tDanger: Boolean;
  loginError: Boolean;
  serverError: Boolean;


  constructor(private fb: FormBuilder, private httpService: HttpService) { }

  ngOnInit() {

    this.logForm = this.fb.group({
      teamName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]],
      password: ['', [Validators.required]]
    })

  }

  loggingIn() {
    this.loginError = false;
    this.serverError = false;
    console.log("We're logging in!")
    const model = this.logForm.value;
    if(this.logForm.status == "VALID"){
      let login = {name: "", password: ""};
      login.name = model.teamName;
      login.password = model.password;
      this.logForm.reset();
      this.httpService.loginTeam(login, (res) => {
        if(res.status){
          console.log("successful login, we should go into the app")
        }
        else {
          if(res.message){
            this.serverError = true;
          }
          else {
            this.loginError = true;
          }
        }
      });
    }
    else {
      console.log("You're a stubborn one, aren't you?")
    }
  }

  fieldChanged(){
    if(this.serverError || this.loginError){
      this.serverError = false;
      this.loginError = false;
    }
  }

  get teamName() {
    let newTeam = this.logForm.get('teamName');
    let TError = newTeam.errors ? newTeam.errors : {};

    this.tLen = TError["minlength"] && newTeam["touched"];
    this.tLenMax = TError["maxlength"];
    this.tReq = TError["required"] && newTeam["touched"];
    this.tDanger = this.tLen || this.tReq || this.tLenMax;

    return newTeam;
  }

}
