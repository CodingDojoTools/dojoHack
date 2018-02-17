import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { CountdownService } from '../countdown.service';
import { Hackathon, Session } from '../models';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';


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
        
        this.session = session;
        this.getJoined();
        this.getPosted();
        this.getPast();
      },
      err => console.log(err)
    )
   
   
    
  }
  getJoined(){
    this.httpService.getObs('/hackathons/joined').subscribe(
      body => {
        this.joinedHackathons = body['hackathons'];
        for(let hack of this.joinedHackathons){
         
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
                console.log(err);
              }
            ))
          }
          hack['status'] = 3;
        }
        
      },
      err => console.log(err)
    )
  }
  getPosted(){
    this.httpService.getObs('/hackathons/current').subscribe(
      body => {
        this.postedHackathons = body['hackathons'];
       
      },
      err => console.log(err)
    )
  }

  getPast(){
    this.httpService.getObs('/hackathons/past').subscribe(
      body => this.pastHackathons = body['hackathons'],
      err => console.log(err)
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

  

}
