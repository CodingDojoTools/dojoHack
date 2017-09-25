import { Component, OnInit, trigger, transition, style, animate } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { HttpService } from '../http.service';
import { Team } from '../models';
import { Router } from '@angular/router';

export function comparePassword(group: FormGroup){
  const pass = group.value;
  return (pass.password === pass.confirmPassword) ? null : {invalid: true}
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [
    trigger(
      'errorAnimation',
      [
        transition(
          ':enter', [
            style({height: 0, opacity: 0}),
            animate('300ms', style({height: 18, opacity: 1}))
          ]
        ),
        transition(
          ':leave', [
            style({height: 18, opacity: 1}),
            animate('300ms', style({height: 0, opacity: 0})),
          ]
        )
      ]
    )
  ],
})
export class RegisterComponent implements OnInit {

  
  constructor(private fb: FormBuilder, private httpService: HttpService, private _router: Router) { }

  locations = [];
  newTeam = new Team();
  pDanger: boolean;

  PError: object;
  pLen: boolean;
  pMatch: boolean;
  pR: boolean;
  pValid: boolean = false;
  regForm: FormGroup;
  serverRegError: string;
  teamTaken: boolean; 

  teamValid: boolean = false;

  TError: object;


 
  register(){

    const model = this.regForm.value;
    if(this.regForm.status=="VALID"){
      this.newTeam.name = model.teamName;
      this.newTeam.password = model.passGroup.password;
      this.newTeam.confirmPassword = model.passGroup.confirmPassword;
      this.newTeam.location = model.location;
      console.log(this.newTeam);
      this.httpService.postObs('/register', this.newTeam).subscribe(
        data => {
          for(let member of model.members){
            this.httpService.postObs('/teams/addmember', member).subscribe(
              body => {
                console.log("got one member body", body);
                this._router.navigate(['/dashboard'])
              },
              err => console.log("Error with one member", err)
              
            )
          }
          
        },
        err => {
          console.log("Got the register error", err)
          this.serverRegError = err;
          if(this.serverRegError == "This team name is already taken"){
            console.log("mark in teeror");
            
            this.teamTaken = true;
          }
        }
      )
    }

  }
  cancel(){
    this.regForm.reset();
  }

  ngOnInit() {
    this.regForm = this.fb.group({
      teamName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]],
      passGroup: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]]
      }, {validator: comparePassword}),
      location: ['', [Validators.required]],
      members: this.fb.array([
        this.initMember()
      ])
    })
    this.getLocations();
    this.regForm.valueChanges.subscribe(
      data => {
        this.teamTaken = false;
        this.serverRegError = null;
      }
    )
  }

  getLocations(){
    this.httpService.getObs('/locations').subscribe(
      body => this.locations = body['locations'],
      err => console.log("locations error", err)
    )
  }

  initMember(){
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]]
    })
  }

  addMember(){
    let control = <FormArray>this.regForm.controls['members'];
    if(control.length < 5){
      control.push(this.initMember());
    }
  }

  removeMember(index){
    
    let control = <FormArray>this.regForm.controls['members'];
    control.removeAt(index);
  }

  get passGroup(){
    return this.regForm.get('passGroup');
  }

  get teamName() {
    let newTeam = this.regForm.get('teamName');
    this.TError = newTeam.errors ? newTeam.errors : {};
    return newTeam;
  }

  get password(){
    let newPass = this.passGroup.get('password');
    this.PError = newPass.errors ? newPass.errors : {};

    this.pLen = this.PError["minlength"] && newPass["touched"];
    this.pR = this.PError["required"] && newPass["touched"];

    this.pDanger = this.pLen || this.pR;

    return newPass;
  }

  get locReq(){
    let loc = this.regForm.get('location');
    let control = <FormArray>this.regForm.controls['members'];
    let locError = loc.errors ? loc.errors : {};
    if(locError["required"] && control["dirty"]){
      return true;
    }
    return false;
  }
  get confirmPassword(){
    return this.passGroup.get('confirmPassword');
  }

  get CPDanger(){
    let cp = this.confirmPassword;
    return this.passGroup.invalid && cp.touched
  }
}
