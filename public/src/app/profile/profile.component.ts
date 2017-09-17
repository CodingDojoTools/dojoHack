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
    this.getMembers();
  }
  getMembers(){
    this.httpService.getTeamMembers((res)=>{
      if(res.status){

      }
    })
  }

}
