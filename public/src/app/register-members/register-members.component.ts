import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register-members',
  templateUrl: './register-members.component.html',
  styleUrls: ['./register-members.component.css']
})
export class RegisterMembersComponent implements OnInit {
  @Input('group')
  public memberForm: FormGroup;
  FNDanger: Boolean;
  firstReq: Boolean;
  firstLen: Boolean;
  LNDanger: Boolean;
  lastReq: Boolean;
  lastLen: Boolean;
  
  constructor() { 
    
  }

 

  ngOnInit() {
    console.log("got a member Form", this.memberForm)
    console.log(this.memberForm.valid)
  }

  get firstName(){
    let fn = this.memberForm.get('firstName');
    this.FNDanger = fn.invalid && fn.touched;
    let FNError = fn.errors ? fn.errors : {};
    this.firstReq = FNError['required'] && fn.touched;
    this.firstLen = FNError['minlength'] && fn.touched;
    return fn;  
  }
  get lastName(){
    let ln = this.memberForm.get('lastName');
    this.LNDanger = ln.invalid && ln.touched;
    let LNError = ln.errors ? ln.errors : {};
    this.lastReq = LNError['required'] && ln.touched;
    this.lastLen = LNError['minlength'] && ln.touched;
    return ln;
  }


}
