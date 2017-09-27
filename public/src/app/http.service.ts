import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Hackathon, Project, Session, Team } from './models'; 
import 'rxjs';

@Injectable()
export class HttpService {

  loggedSession = new Session();
  session = new BehaviorSubject(this.loggedSession);
  
  constructor(private _http: Http) { }

  private extractData(res: Response){
    let body = res.json();
    return body || []; 
  }
  private handleError(error: any){
    console.log("error in the private error handler", error.json())
    let err = error.json();
    let errMsg = err.errors ? err.errors : error.status ? `${error.status} - ${error.statusText}` : "Server error";
    console.error(errMsg);
    return Observable.throw({status: error.status, message: errMsg});
  }

  updateSession(session: Session){
    this.session.next(session);
    console.log("Just updated the session", this.session)
  }

  validateMembers(members){
    console.log("in the validate members")
    let observableBatch = [];
    members.forEach((member) => {
      observableBatch.push(
        this._http.post('/teams/isValidMember', member).map(
          res => console.log("the res", res)
        )
      )
    })
    console.log("Observable Batch", observableBatch);
    
    return Observable.forkJoin(observableBatch);
  }

  addMembersToTeam(members){
    let observableBatch = [];
    members.forEach((member) => {
      observableBatch.push(
        this._http.post('/teams/addmember', member).map(
          res => console.log("the res", res)
        )
      )
    })
    console.log("Observable Batch", observableBatch);
    
    return Observable.forkJoin(observableBatch);
  }

  requestSession(){
    console.log("in the request session")
    return this._http.get('/isLoggedIn').map(
      response => {
        console.log("got a response 200", response.json())
        const res = response.json();
        if(res.team){
          this.startTeamSession(res.team);
          return {"admin": false}
        }
        else {
          this.startAdminSession(res.user)
          return {"admin": true};
        }
      },
      err => console.log("error", err)
    )
  }
  
 


  startTeamSession(team){
    this.loggedSession.team = team;
    this.loggedSession.isLoggedIn = true;
    this.updateSession(this.loggedSession);
    
  }
  startAdminSession(admin){
    console.log("someting about admin", admin)
    this.loggedSession.isLoggedIn = true;
    this.loggedSession.admin = admin;
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
        this.startTeamSession(res.team);
        return true
      },
      err => {
        console.log(err.status)
        return err
      }
    )
  }
    
    
 
}
