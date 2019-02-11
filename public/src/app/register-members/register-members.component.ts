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
  FNDanger: boolean;
  firstReq: boolean;
  firstLen: boolean;
  LNDanger: boolean;
  lastReq: boolean;
  lastLen: boolean;
  
  constructor() { 
    
  }

 

  ngOnInit() {}

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
