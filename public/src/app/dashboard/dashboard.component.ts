import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { CountdownService } from '../countdown.service';
import { Hackathon, Session } from '../models';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  joinedHackathons = [];
  postedHackathons = [];
  pastHackathons = [];
  sessionSub: Subscription;
  session: Session;

  constructor(private httpService: HttpService, private _router: Router, private count: CountdownService) { }

  timerSub: Subscription;

  ngOnInit() {
    this.sessionSub = this.httpService.session.subscribe(
      session => {
        console.log("Receiving from behavior subject", session)
        this.session = session;
        this.getJoined();
        this.getPosted();
        this.getPast();
      },
      err => console.log("Error with subscribing to behavior subject",err)
    )
  }
  getJoined(){
    this.httpService.getObs('/hackathons/joined').subscribe(
      body => {
        this.joinedHackathons = body['hackathons'];
        for(let hack of this.joinedHackathons){
          this.count.getTimeLeft(hack);
          if(hack['secondsLeft']){
            this.timerSub = hack['secondsLeft'].subscribe(
              data => {
                if(data <= 3600){
                  hack['danger'] = true;
                }
                else {
                  hack['danger'] = false;
                }
              },
              err => {
                console.log("Error with subscribing to timer");
              }
            )
          }
        }
        
      },
      err => console.log("Could not get joined Hackathons")
    )
  }
  getPosted(){
    this.httpService.getObs('/hackathons/current').subscribe(
      body => this.postedHackathons = body['hackathons'],
      err => console.log("Could not get posted Hackathons")
    )
  }

  getPast(){
    this.httpService.getObs('/hackathons/past').subscribe(
      body => this.pastHackathons = body['hackathons'],
      err => console.log("Could not get past hackathons")
    )
  }

  moveToJoined(hackathon){
    this.getJoined();
    this.getPosted();
    // console.log("We'll move this hackathon", hackathon);
    // const index = this.postedHackathons.indexOf(hackathon);
    // this.postedHackathons.splice(index, 1);
    // this.count.getTimeLeft(hackathon)
    // this.joinedHackathons.push(hackathon);

  }


  ngOnDestroy(){
    this.sessionSub.unsubscribe();
  }

}
