import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { HttpService } from '../http.service';
import { Team, Member } from '../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  proForm: FormGroup;
  loggedTeam = new Team();
  members: Member[] = [];

  constructor(private fb: FormBuilder, private httpService: HttpService, private _router: Router) { }

  ngOnInit() {
    // this.getMembers();
    this.proForm = this.fb.group({
      teamName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]],
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

  // getMembers(){
  //   this.httpService.getTeamMembers((res)=>{
  //     if(res.status){
  //       this.members = res.members;
  //     }
  //     else {
  //       console.log("Having trouble getting the team members");
  //     } 
  //   })
  // }

}
