import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  
  constructor(private fb: FormBuilder) { }

  regForm: FormGroup;

  loggingIn() {
    console.log("We're logging in!")
  }
  register(){
    console.log("We're registering");
  }
  cancel(){
    console.log("We're canceling")
  }


  ngOnInit() {
    this.regForm = this.fb.group({
      teamName: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      location: [''],
      members: this.fb.array([
        this.initMember()
      ])

    })
  }
  initMember(){
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]]
    })
  }

  addMember(){
    let control = <FormArray>this.regForm.controls['members'];
    control.push(this.initMember());
  }



}
