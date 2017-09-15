import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  
  constructor() { }

  loggingIn() {
    console.log("We're logging in!")
  }
  register(){
    console.log("We're registering");
  }
  cancel(){
    console.log("We're canceling")
  }


  ngOnInit() {}



}
