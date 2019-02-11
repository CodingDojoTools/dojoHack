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

  constructor(private _http: Http) {}

  private extractData(res: Response) {
    let body = res.json();
    return body || [];
  }
  private handleError(error: any) {
    let err = error.json();
    let errMsg = err.errors
      ? err.errors
      : error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    return Observable.throw({ status: error.status, message: errMsg });
  }

  updateSession(session: Session) {
    this.session.next(session);
  }

  validateMembers(members) {
    let observableBatch = [];
    members.forEach(member => {
      observableBatch.push(
        this._http
          .post('/teams/isValidMember', member)
          .map(res => console.log(res))
      );
    });

    return Observable.forkJoin(observableBatch);
  }

  addMembersToTeam(members) {
    let observableBatch = [];
    members.forEach(member => {
      observableBatch.push(
        this._http.post('/teams/addmember', member).map(res => console.log(res))
      );
    });

    return Observable.forkJoin(observableBatch);
  }

  requestSession() {
    return this._http.get('/isLoggedIn').map(
      response => {
        const res = response.json();
        if (res.team) {
          this.startTeamSession(res.team);
          return { admin: false };
        } else {
          this.startAdminSession(res.user);
          return { admin: true };
        }
      },
      err => console.log(err)
    );
  }

  startTeamSession(team) {
    this.loggedSession.team = team;
    this.loggedSession.isLoggedIn = true;
    this.updateSession(this.loggedSession);
  }
  startAdminSession(admin) {
    this.loggedSession.isLoggedIn = true;
    this.loggedSession.admin = admin;
    this.updateSession(this.loggedSession);
  }

  getObs(url): Observable<Object> {
    return this._http
      .get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  postObs(url, data): Observable<Object> {
    return this._http
      .post(url, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  // DOWN THERE, THERE BE MONSTERS!!!
  // =========================================================

  loginTeam(team) {
    console.log('logging in team', team);
    return this._http.post('/login', team).map(
      response => {
        console.log('response', response);
        const res = response.json();
        this.startTeamSession(res.team);
        return true;
      },
      err => {
        return err;
      }
    );
  }
}
