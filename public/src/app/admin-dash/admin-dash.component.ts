import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { Hackathon, Session } from '../models';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-admin-dash',
  templateUrl: './admin-dash.component.html',
  styleUrls: ['./admin-dash.component.css']
})
export class AdminDashComponent implements OnInit {
  
  hackathons = [];


  constructor(private httpService: HttpService, private _router: Router) { }


  ngOnInit() {
    this.getHackathons();
  }
  getHackathons(){
    this.httpService.getObs('/hackathons/all').subscribe(
      data => {
        console.log("got all hackathons", data)
        this.hackathons = data['hackathons']
      },
      err => console.log("Got an error trying to get hackathons", err)
    )
  }

}
