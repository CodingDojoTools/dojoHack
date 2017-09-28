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
  pastHackathons = [];
  postedHackathons = [];
  session: Session;
  sessionSub: Subscription;

  constructor(private httpService: HttpService, private _router: Router, private count: CountdownService) { }

  timerSub: Subscription[] = [];
  updateTeamMsg: string;

  ngOnInit() {
    this.updateTeamMsg = this.count.updateTeamMsg;
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
          this.convertToLocalTime(hack.deadline);
          
          this.count.getTimeLeft(hack);
          if(hack['secondsLeft']){
            this.timerSub.push(hack['secondsLeft'].subscribe(
              data => {
                if(data == 0){
                  hack['status'] = 3;
                }
                else if(data <= 3600){
                  hack['status'] = 2;
                }
                else {
                  hack['status'] = 1;
                }
              },
              err => {
                console.log("Error with subscribing to timer");
              }
            ))
          }
          hack['status'] = 3;
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

  }


  ngOnDestroy(){
    this.sessionSub.unsubscribe();
    if(this.timerSub.length > 0){
      for(let sub of this.timerSub){
        sub.unsubscribe();
      }
    }
    this.count.updateTeamMsg = null;
  }

  convertToLocalTime(utc){
  //   Date.prototype.addHours = function(h) {    
  //     this.setTime(this.getTime() + (h*60*60*1000)); 
  //     return this;   
  //  }
    var currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    var deadline = new Date(utc);
    deadline.setTime(deadline.getTime() + (currentTimeZoneOffsetInHours*60*60*1000));
    console.log("deadine", deadline)
    
    


    // console.log("what's the utc", utc)
    // var x = new Date(utc);
    // var currentTimeZoneOffsetInHours = x.getTimezoneOffset() / 60;
    
    // // Get timezone offset for International Labour Day (May 1) in 2016
    // // Be careful, the Date() constructor uses 0-indexed month so May is
    // // represented with 4 (and not 5)
    // var labourDay = new Date(2016, 4, 1)
    // var labourDayOffset = labourDay.getTimezoneOffset() / 60;
    // console.log("LDO", labourDayOffset)

    // console.log(x + currentTimeZoneOffsetInHours)
  }

}
