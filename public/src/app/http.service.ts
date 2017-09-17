import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Hackathon } from './models';
import 'rxjs';

@Injectable()
export class HttpService {
  loggedInId: Number;
  isLoggedIn = true;
  redirectUrl: String;
  postedHackathons: Hackathon[] = [];
  pastHackathons: Hackathon[] = [];
  joinedHackathons: Hackathon[] = [];
  count = 60;
  locations = [];
  constructor(private _http: Http) { }

  login(): Boolean {
    return this.isLoggedIn;
  }

  loginTeam(team, callback){
    console.log("in the service about to login a team", team)
    this._http.post('/login', team).subscribe(
      (response) => {
        let res = response.json();
        this.loggedInId = res.userId
        this.isLoggedIn = true;
        callback(res);
      },
      (err) => {
        console.log("Got an error trying to login", err);
        callback({status: false, message: "catch"})
      }
    )
  }

  registerTeam(team){
    console.log("in service about to register a team", team);
    this._http.post('/register', team).subscribe(
      (response) => {
        console.log("got a response from post to register", response.json());
        
      },
      (err) => {
        console.log("Got an error trying to register", err);
      }
    )
  }

  retrieveLocations(callback){
    this._http.get('/locations').subscribe(
      (response) => {
        console.log("got a response", response)
        //response from request
        this.locations = response.json();
    
        callback(this.locations)
      },
      (err) => {
        // error object on failed request
        console.log("Got an error, failed request", err)
      }
    )
  }

  fetchPosted(callback){
    this._http.get('/hackathons/current').subscribe(
      (response) => {
        
        let res = response.json();
        if(res.hackathons){
          this.postedHackathons = res.hackathons;
          callback({status: true, hacks: this.postedHackathons});
          
        }
        else {
          callback({status: false})
        }
      },
      (err) => {
        console.log("Got an error, failed hackathon request", err)
      }
    )
  }

  fetchPast(callback){
    this._http.get('/hackathons/past').subscribe(
      (response) => {
        let res = response.json();
        if(res.hackathons){
          this.pastHackathons = res.hackathons;
          callback({status: true, hacks: this.pastHackathons});
        }
        else {
          callback({status: false})
        }
      },
      (err) => {
        console.log("Error getting past hackathons in service", err);
      }
    )
  }

  joinHackathon(hack, callback){
    this._http.get(`/hackathons/${hack.id}/join`).subscribe(
      (response) => {
        let res = response.json();
        if(res.status){
          let index = this.postedHackathons.indexOf(hack);
          this.postedHackathons.splice(index, 1);
          this.getTimeLeft(hack);
          this.joinedHackathons.push(hack);
        }
        callback(res)
      },
      (err) => {
        console.log("Error trying to join in service", err);
      }
    )
  }
  fetchJoined(callback){
    this._http.get('/hackathons/joined').subscribe(
      (response)=>{
        let res = response.json();
        if(res.hackathons){
          // go through the array of recieved hackathons
          // give each an attribute of timeLeft, which is equal to what gets returned from countdown function
          for(let hack of res.hackathons){
            // const due = new Date(hack.deadline).getTime();
            // const now = new Date().getTime();
            // const left = Math.trunc((due - now)/1000);
            // console.log("left on 133", left)
            // hack["timeLeft"] = this.countdown(left);
            this.getTimeLeft(hack);
          }
          this.joinedHackathons = res.hackathons;
          callback({status: true, hacks: this.joinedHackathons});
        }
        else {
          callback({status: false})
        }
      },
      (err) => {
        console.log("Error getting the joined hackathons in service", err)
      }
    )
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
      while(calcdeadline >= 604800){
        weeks++;
        calcdeadline -= 604800;
      }
      if(weeks > 1){
        toreturn += `${weeks} weeks `
      }
      else if(weeks == 1){
        toreturn += "1 week ";
      }
      while(calcdeadline >= 86400){
        days++;
        calcdeadline -= 86400;
      }
      if(days > 1){
        toreturn += `${days} days `;
      }
      else if(days == 1){
        toreturn += "1 day ";
      }
      // console.log("got days", days)
      
      while(calcdeadline >= 3600){
        hours++;
        calcdeadline -= 3600;
      }
      if(hours > 1){
        toreturn += `${hours} hours `;
      }
      else if(hours == 1){
        toreturn += "1 hour "
      }
      while(calcdeadline >= 60){
        minutes++;
        calcdeadline -= 60
      }
      if(minutes > 1 || minutes == 0){
        toreturn += `${minutes} minutes `;
      }
      else if(minutes == 1){
        toreturn += "1 minute ";
      }

      seconds = calcdeadline;
      if(seconds > 1 || seconds == 0){
        toreturn += `${seconds} seconds`
      }
      else if(seconds == 1){
        toreturn += "1 second" 
      }
      return toreturn;
    })
  }
}
