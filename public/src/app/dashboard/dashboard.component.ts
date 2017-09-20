import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
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

  constructor(private httpService: HttpService, private _router: Router) { }

  ngOnInit() {
    this.sessionSub = this.httpService.session.subscribe(
      session => {
        console.log("Receiving from behavior subject", session)
        this.session = session;
        if(session){
          this.joinedHackathons = session.joinedHackathons;
          for(let hack of this.joinedHackathons){
            this.getTimeLeft(hack);
          }
          this.pastHackathons = session.pastHackathons;
          this.postedHackathons = session.postedHackathons;
        }
      },
      err => console.log("Error with subscribing to behavior subject",err)
    )
  }

  moveToJoined(hackathon){
    console.log("We'll move this hackathon", hackathon);
    const index = this.postedHackathons.indexOf(hackathon);
    this.postedHackathons.splice(index, 1);
    this.getTimeLeft(hackathon)
    this.joinedHackathons.push(hackathon);

  }


  getTimeLeft(hackathon){
    const due = new Date(hackathon.deadline).getTime();
    const now = new Date().getTime();
    const left = Math.trunc((due-now)/1000);
    hackathon["timeLeft"] = this.countdown(left);
    hackathon["danger"] = this.countdownInt(left);
  }

  countdownInt(deadline){
    return Observable.timer(0,1000)
    .take(deadline)
    .map(() => {
      deadline--;
      if(deadline > 86400){
        return false;
      }
      return true;
    })
  }

  pad(num){
    let pad = ""
    if (num < 10) pad = "0";
    return pad+num;
  }

  countdown(deadline){
    return Observable.timer(0,1000)
    .take(deadline)
    .map(() => { deadline--;
      // 60 seconds in a minute
      // 60 minutes in an hour, 3600 seconds in an hour
      // 24 hours in a day, 1440 minutes in a day, 86400 seconds in a day
      // 7 days in a week, 168 hours in a week, 10080 minutes in a week, 604800 seconds in a week
      var toreturn = ""
      var weeks = 0;
      var days = 0;
      var hours = 0;
      var minutes = 0;
      var seconds = 0;
      var calcdeadline = deadline;

      weeks = Math.floor(calcdeadline / 604800);
      calcdeadline %= 604800;

      if(weeks > 1) toreturn += `${weeks} weeks `;
      else if(weeks == 1) toreturn += "1 week ";
      
      days = Math.floor(calcdeadline / 86400);
      calcdeadline %= 86400;
    
      if(days > 1) toreturn += `${days} days `;
      else if(days == 1) toreturn += "1 day ";

      if (weeks) return toreturn;

      // new
      hours = Math.floor(calcdeadline / 3600);
      calcdeadline %= 3600;
      
      minutes = Math.floor(calcdeadline / 60);
      calcdeadline %= 60;

      seconds = calcdeadline;

      toreturn += `${this.pad(hours)}h `;
      toreturn += `${this.pad(minutes)}m `;
      toreturn += `${this.pad(seconds)}s`;
      
      return toreturn;
    })
  }

 

  ngOnDestroy(){
    this.sessionSub.unsubscribe();
  }

}
