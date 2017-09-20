import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  
  constructor(private fb: FormBuilder, private httpService: HttpService, private _router: Router) { }

  newTeam = new Team();

  regForm: FormGroup;
  

  locations = [];

  TError: Object;
  PError: Object;
  pDanger: Boolean;
  pLen: Boolean;
  pR: Boolean;
  pMatch: Boolean;
  pValid: Boolean = false;

  teamValid: Boolean = false;

 
  register(){

    const model = this.regForm.value;
    if(this.regForm.status=="VALID"){
      this.newTeam.name = model.teamName;
      this.newTeam.password = model.passGroup.password;
      this.newTeam.confirmPassword = model.passGroup.confirmPassword;
      this.newTeam.location = model.location;
      console.log(this.newTeam);
      this.httpService.postObs('/register', this.newTeam).subscribe(
        body => {
          console.log("Got the register body", body)
          for(let member of model.members){
            this.httpService.postObs('/teams/addmember', member).subscribe(
              body => console.log("got one member body", body),
              err => console.log("Error with one member", err)
              
            )
          }
          this._router.navigate(['/dashboard'])
        },
        err => console.log("Got the register error", err)
      )
    }
    //   this.httpService.registerTeam(this.newTeam, (res) => {
    //     if(res.status){
    //       for(let member of model.members){
    //         this.regMember(member)
    //       }
    //       this.regForm.reset();
    //       this.newTeam = new Team();
    //       this._router.navigate(['/dashboard']);
    //     }
    //     else {
    //       console.log("We'll have to handle error messages")
    //     }
    //     });
    // }
    // else {
    //   console.log("nice try");
    // }

  }
  cancel(){
    this.regForm.reset();
    console.log("We're canceling")
  }

  regMember(member){
    this.httpService.registerMember(member, (res)=>{
      if(res.status){
        console.log("Added member")
      }
      else {
        console.log("We'll have to handle error messages if we can't include the member on the team")
      }
    })
  }


  ngOnInit() {
    this.regForm = this.fb.group({
      teamName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]],
      passGroup: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]]
      }, {validator: comparePassword}),
      location: [''],
      members: this.fb.array([
        this.initMember()
      ])
    })
    this.getLocations();

    // this.httpService.retrieveLocations((locs)=> {
    //   this.locations = locs;
    //   console.log("We got the locations", locs)
    // })
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

    // if (newPass.valid) this.confirmPassword.enable();

    return newPass;
  }
  get confirmPassword(){
    return this.passGroup.get('confirmPassword');
  }

  get CPDanger(){
    let cp = this.confirmPassword;
    return this.passGroup.invalid && cp.touched
  }



}
