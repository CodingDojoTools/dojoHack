import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Hackathon, Project, Session, Team } from './models'; 
import 'rxjs';

@Injectable()
export class HttpService {

  private extractData(res: Response){
    let body = res.json();
    return body || []; 
  }
  private handleError(error: any){
    console.log("error in the private error handler", error)
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : "Server err";
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  updateSession(session: Session){
    this.session.next(session);
    console.log("Just updated the session", this.session)
  }

  requestSession(){
    console.log("in the request session")
    return this._http.get('/isLoggedIn').map(
      response => {
        console.log("got a response 200", response.json())
        const res = response.json();
        this.startSession(res.team);
        return true
      },
      err => console.log("error", err)
    )
  }
  
  loggedSession = new Session();
  session = new BehaviorSubject(this.loggedSession);
  
  constructor(private _http: Http) { }


  startSession(team){
    this.loggedSession.team = team;
    this.loggedSession.isLoggedIn = true;
    this.updateSession(this.loggedSession);
    
  }
 
  getObs(url): Observable<Object>{
    return this._http.get(url)
    .map(this.extractData)
    .catch(this.handleError)
  }
  
  postObs(url, data): Observable<Object>{
    return this._http.post(url, data)
    .map(this.extractData)
    .catch(this.handleError)

  }


  // DOWN THERE, THERE BE MONSTERS!!!
  // =========================================================
  
  

  loginTeam(team){
    console.log("in the service about to login a team", team)
    return this._http.post('/login', team).map(
      response => {
        const res = response.json();
        this.startSession(res.userId);
        return true
      },
      err => {
        console.log(err.status)
        return err
      }
    )
  }
    
    
 
}
