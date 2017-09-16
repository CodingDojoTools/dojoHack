import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { Router } from '@angular/router';
import { Hackathon } from '../../models';

@Component({
  selector: 'app-joined',
  templateUrl: './joined.component.html',
  styleUrls: ['./joined.component.css']
})
export class JoinedComponent implements OnInit {
  joinedHackathons: Hackathon[] = [];

  constructor(private httpService: HttpService, private _router: Router) { }

  ngOnInit() {
    this.httpService.fetchJoined((res)=>{
      if(res.status){
        this.joinedHackathons = res.hacks;
        console.log("we've joined these", this.joinedHackathons)
      }
      else {
        console.log("Could not get joined hackathons")
      }
    })
   
  }
  


  }

