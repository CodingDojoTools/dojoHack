import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Hackathon, Project, Session, Team } from './models'; 
import 'rxjs';

@Injectable()
export class HttpService {

  

  updateSession(session: Session){
    this.session.next(session);
  }
  
  loggedSession = new Session();
  session = new BehaviorSubject(this.loggedSession);
  loggedInId: number;
  isLoggedIn = false;
  loggedTeamName: string;
  postedHackathons: Hackathon[] = [];
  pastHackathons: Hackathon[] = [];
  joinedHackathons: Hackathon[] = [];
  allHackathons: Hackathon[] = [];
  selectedHackathon: Hackathon;
 
  errorMessage

  constructor(private _http: Http) { }

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

  login(): boolean {
    return this.isLoggedIn;
  }
  logout() {
    this.loggedSession = new Session();

    //redundant
    this.loggedInId = null;
    this.isLoggedIn = false;
    this.loggedTeamName = null;
    this.postedHackathons = [];
    this.pastHackathons = [];
    this.joinedHackathons = [];
    this.allHackathons = [];
  }
  startSession(teamid){
    this.loggedSession.loggedInId = teamid;
    this.loggedSession.isLoggedIn = true;
    this.getAllData(teamid);
  }
 
  getAllData(teamid){
    console.log("About to get all data");
    
    this.getObs('/teams/logged').subscribe(
      body => {
        this.loggedSession.loggedTeam = body['team'];
        this.updateSession(this.loggedSession);
      },
      error => this.errorMessage = <any>error
    );
    
    this.getObs('/hackathons/current').subscribe(
      body => {
        this.loggedSession.postedHackathons = body['hackathons'];
        this.updateSession(this.loggedSession);
      },
      error => this.errorMessage = <any>error
    );

    this.getObs('/hackathons/past').subscribe(
      body => {
        this.loggedSession.pastHackathons = body['hackathons'];
        this.updateSession(this.loggedSession);
      },
      error => this.errorMessage = <any>error
    );

    this.getObs('/hackathons/joined').subscribe(
      body => {
        this.loggedSession.joinedHackathons = body['hackathons'];
        // if(body['hackathons']){
        //   for(let hack of body['hackathons']){
        //     this.getTimeLeft(hack);
        //   }
        // }
        this.updateSession(this.loggedSession);
      },
      error => this.errorMessage = <any>error
    );

    this.getObs('/teams/members').subscribe(
      body => {
        this.loggedSession.loggedMembers = body['members'];
        this.updateSession(this.loggedSession);
      },
      error => this.errorMessage = <any>error
    );

  }

  buildAllHacksObject(arr){
    for(let hack of arr){
      this.loggedSession.allHackathons[hack.id] = hack;
    }
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

  joinHackathon(hack, callback){
    this._http.get(`/hackathons/${hack.id}/join`).subscribe(
      (response) => {
        let res = response.json();
        if(res.status){
          let index = this.postedHackathons.indexOf(hack);
          this.postedHackathons.splice(index, 1);
          // this.getTimeLeft(hack);
          // this.joinedHackathons.push(hack);
          this.allHackathons = this.postedHackathons.concat(this.joinedHackathons, this.pastHackathons);
        }
        callback(res)
      },
      (err) => {
        console.log("Error trying to join in service", err);
      }
    )
  }

  // submitProject(project, id, callback){
  //   console.log("We'll submit this", project);
  //   this._http.post(`/hackathons/${id}/addproject`, project).subscribe(
  //     (response) => {
  //       const res = response.json();
  //       console.log("We got our response", res)
  //       callback(res)
  //     },
  //     (err) => {
  //       console.log("Error trying to submit a project in service", err)
  //       callback({status: false})
  //     }
  //   )
  // }

  // DOWN THERE, THERE BE MONSTERS!!!
  // =========================================================
  
  requestSession(){
    console.log("in the request session")
    return this._http.get('/isLoggedIn').map(
      response => {
        console.log("got a response 200")
        const res = response.json();
        this.startSession(res.userId);
        return true
      },
      err => console.log("error", err)
    )
  }

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
    
    
    
    // subscribe(
    //   (response) => {
    //     const res = response.json();
    //     if(res.status){
    //       this.startSession(team.name, res.userId);
    //       this.loggedInId = res.userId
    //       this.isLoggedIn = true;
    //       this.loggedTeamName = team.name;
    //     }
        
    //     callback(res);
    //   },
    //   (err) => {
    //     console.log("Got an error trying to login", err);
    //     callback({status: false, message: "catch"})
    //   }
    // )
  


  //      //redundant
    

  //   return this._http.post('/login').map(
  //     response => {
  //       const res = response.json();
  //       this.startSession(res.userId);
  //     },
  //     err => {
  //       console.log("Got an error logging in", err)
  //     }
  //   );
  // }

  //   this._http.post('/login', team).subscribe(
  //     (response) => {
  //       const res = response.json();
  //       if(res.status){
  //         this.startSession(res.userId);
  //         this.loggedInId = res.userId
  //         this.isLoggedIn = true;
  //         this.loggedTeamName = team.name;
  //       }
        
  //       callback(res);
  //     },
  //     (err) => {
  //       console.log("Got an error trying to login", err);
  //       callback({status: false, message: "catch"})
  //     }
  //   )
  // }
  getTeamMembers(callback){
    // this._http.get("/teams/members").subscribe(
    // this._http.get("/teams/members").map(response => response.json())
    //   (response) => {
    //     const res = response.json();
    //     if(res.members){
    //       callback({status: true, members: res.members})
    //     }
    //     else {
    //       callback({status: false});
    //     }
    //   },
    //   (err) => {
    //     console.log("Got an error trying to fetch team members", err);
    //     callback({status: false});
    //   }
    // )
  }
 

  registerTeam(team, callback){
    console.log("in service about to register a team", team);
    this._http.post('/register', team).subscribe(
      (response) => {
        const res = response.json();
        if(res.status){
          this.startSession(res.userId);
          this.loggedInId = res.userId;
          this.isLoggedIn = true;
          this.loggedTeamName = team.name;
        }
        callback(res);
      },
      (err) => {
        callback({status: false, message: "Server error"})
        console.log("Got an error trying to register", err);
      }
    )
  }

  registerMember(member, callback){
    console.log("in service about to register a member", member);
    this._http.post('/teams/addmember', member).subscribe(
      (response) => {
        const res = response.json();
        callback(res);
      },
      (err) => {
        callback({status: false, message: "Server error"})
        console.log("Got an error trying to register a team member", err)
      }
    )
  }



 


  
  getOneHackathon(id, callback){
    var found = false;
    for(let hack of this.allHackathons){
      if(hack.id == id){
        found = true;
        callback({status: true, hackathon: hack});
        break;
      }
    }
    if(!found){
      callback({status: false})
    }
  }

  getOneJoinedHackathon(id, callback){
    var found = false;
    
    for(let hack of this.session['joinedHackathons']){
      if(hack.id == id){
        found = true;
        callback({status: true, hackathon: hack});
        break;
      }
    }
    if(!found){
      callback({status: false});
    } 
  }

  getHackathonSubmissions(id, callback){
    this._http.get(`hackathons/${id}/submissions`).subscribe(
      (response)=>{
        
        let res = response.json()
        console.log("got a response", res)
        if(res.submissions){
          callback({status: true, submissions: res.submissions})
        }
      },
      (err)=>{
        callback({status: false})
      }
    )
  }

 
}
