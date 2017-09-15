import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.css']
})
export class DynamicComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  myForm: FormGroup;

  // myGroup: FormGroup;

  // myFormArray: FormArray;

  

  

  ngOnInit() {
    // this.myFormArray = new FormArray([]);
    this.myForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      addresses: this.fb.array([
        this.initAddress()
      ])
    })

  //   this.myGroup = new FormGroup({
  //     firstName: new FormControl(),
  //     lastName: new FormControl()
  //  });
    // console.log("form array", this.myFormArray)
    // this.myFormArray.push(this.myGroup);
    // console.log("form array after push", this.myFormArray)
  }

  save(myGroup){
    console.log("saving!", myGroup);
  }

  initAddress(){
    return this.fb.group({
      street: ['', [Validators.required, Validators.minLength(3)]],
      postcode: ['']
    })
  }

  addAddress(){
    let control = <FormArray>this.myForm.controls['addresses'];
    control.push(this.initAddress());
  }

  removeAddress(i: number){
    let control = <FormArray>this.myForm.controls['addresses'];
    control.removeAt(i);
  }

  
  

}
