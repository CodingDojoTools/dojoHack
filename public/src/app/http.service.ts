import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs';

@Injectable()
export class HttpService {

  locations = [];
  constructor(private _http: Http) { }

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

}
