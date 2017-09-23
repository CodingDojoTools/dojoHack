import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, NavigationEnd } from '@angular/router';

@Injectable()
export class CountdownService {
  submissionFlashMessage: string;
  logoutMsg: string;

  previousUrl: string;
  currentUrl: string;

  constructor(private _router: Router) { 
    this._router.events
    .filter(event => event instanceof NavigationEnd)
    .subscribe(e => {
      console.log('prev:', this.previousUrl);
      this.previousUrl = this.currentUrl;
      this.currentUrl = e['url'];      
    });
  }



  getTimeLeft(hackathon){
    
    const due = new Date(hackathon.deadline).getTime();
    const now = new Date().getTime();
    const left = Math.trunc((due-now)/1000);
    console.log("left", left);
    if(left <= 0){
      hackathon['over'] = true;
    }
    else {
      hackathon["timeLeft"] = this.countdown(left);
      hackathon["secondsLeft"] = this.countdownInt(left);
    }
  }

  countdownInt(deadline){
    
    return Observable.timer(0,1000)
    .take(deadline)
    .map(() => {      
      deadline--;
      return deadline;
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
    .map(() => { 
      deadline--;
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


}
