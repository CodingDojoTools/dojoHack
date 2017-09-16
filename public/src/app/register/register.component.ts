import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { HttpService } from '../http.service';
import { Team } from '../team';

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

  
  constructor(private fb: FormBuilder, private httpService: HttpService) { }

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
      this.httpService.registerTeam(this.newTeam);
      this.regForm.reset();
      this.newTeam = new Team();
    }
    else {
      console.log("nice try");
    }

  }
  cancel(){
    this.regForm.reset();
    console.log("We're canceling")
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

    // this.httpService.retrieveLocations((locs)=> {
    //   this.locations = locs;
    //   console.log("We got the locations", locs)
    // })
  }
  // {value: "", disabled: true}

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
