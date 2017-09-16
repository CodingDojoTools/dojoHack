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


}
