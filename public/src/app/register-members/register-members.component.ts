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
  
  constructor() { }

  ngOnInit() {
  }

}
