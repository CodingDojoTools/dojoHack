import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Hackathon, Project, Session, Team } from './models'; 
import 'rxjs';

@Injectable()
export class HttpService {
  
  loggedSession = new Session();
  loggedInId: number;
  isLoggedIn = false;
  loggedTeamName: string;
  postedHackathons: Hackathon[] = [];
  pastHackathons: Hackathon[] = [];
  joinedHackathons: Hackathon[] = [];
  allHackathons: Hackathon[] = [];
  selectedHackathon: Hackathon;
  submissionFlashMessage: string;
  errorMessage

  constructor(private _http: Http) { }

  private extractData(res: Response){
    let body = res.json();
    return body || []; 
  }
  private handleError(error: any){
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

    // redundant
    this.loggedInId = teamid;
    this.isLoggedIn = true;
  }
 
  getAllData(teamid){
    console.log("About to get all data");
    
    this.getLoggedTeam().subscribe(
      body => this.loggedSession.loggedTeam = body['team'],
      error => this.errorMessage = <any>error);
    
    this.fetchPostedHackathons().subscribe(
      body => this.loggedSession.postedHackathons = body['hackathons'],
      error => this.errorMessage = <any>error);
    this.fetchCompletedHackathons();
    this.fetchJoinedHackathons();
    this.fetchLoggedMembers();

  }
  fetchLoggedMembers(){
    this._http.get('/teams/members')
    .map(response => {
      const res = response.json();
      this.loggedSession.loggedMembers = res.members;
    })
    .catch(err => err.json())
  }

  buildAllHacksObject(arr){
    for(let hack of arr){
      this.loggedSession.allHackathons[hack.id] = hack;
    }
  }

  fetchPostedHackathons(): Observable<Object>{
    return this._http.get('/hackathons/current')
    .map(this.extractData) 
    .catch(this.handleError);
  }

  getLoggedTeam(): Observable<Object>{
    return this._http.get('/teams/logged')
    .map(this.extractData)
    .catch(this.handleError)
  }

  

  fetchCompletedHackathons(){
    this._http.get('/hackathons/past')
    .map(response=> {
      const res = response.json();
      this.loggedSession.pastHackathons = res.hackathons;
      this.buildAllHacksObject(res.hackathons);
    })
    .catch(err => err.json())
  }

  fetchJoinedHackathons(){
    this._http.get('/hackathons/joined')
    .map(response => {
      const res = response.json();
      if(res.hackathons){
        for(let hack of res.hackathons){
          this.getTimeLeft(hack);
        }
        this.loggedSession.joinedHackathons = res.hackathons;
        this.buildAllHacksObject(res.hackathons);
      }
    })
    .catch(err => err.json())
  }

  

//  fetchPosted(callback){
//     this._http.get('/hackathons/current').subscribe(
//       (response) => {
//         let res = response.json();
//         if(res.hackathons){
//           this.postedHackathons = res.hackathons;
//           this.allHackathons = this.postedHackathons.concat(this.joinedHackathons, this.pastHackathons);
//           callback({status: true, hacks: this.postedHackathons});
//         }
//         else {
//           callback({status: false})
//         }
//       },
//       (err) => {
//         console.log("Got an error, failed hackathon request", err)
//       }
//     )
//   }

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
  fetchJoined(callback){
    this._http.get('/hackathons/joined').subscribe(
      (response)=>{
        let res = response.json();
        if(res.hackathons){
          for(let hack of res.hackathons){
            this.getTimeLeft(hack);
          }
          this.joinedHackathons = res.hackathons;
          this.allHackathons = this.postedHackathons.concat(this.joinedHackathons, this.pastHackathons);
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

  fetchPast(callback){
    this._http.get('/hackathons/past').subscribe(
      (response) => {
        let res = response.json();
        if(res.hackathons){
          this.pastHackathons = res.hackathons;
          this.allHackathons = this.postedHackathons.concat(this.joinedHackathons, this.pastHackathons);
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

  fetchPosted(callback){
    this._http.get('/hackathons/current').subscribe(
      (response) => {
        let res = response.json();
        if(res.hackathons){
          this.postedHackathons = res.hackathons;
          this.allHackathons = this.postedHackathons.concat(this.joinedHackathons, this.pastHackathons);
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

 

  joinHackathon(hack, callback){
    this._http.get(`/hackathons/${hack.id}/join`).subscribe(
      (response) => {
        let res = response.json();
        if(res.status){
          let index = this.postedHackathons.indexOf(hack);
          this.postedHackathons.splice(index, 1);
          this.getTimeLeft(hack);
          this.joinedHackathons.push(hack);
          this.allHackathons = this.postedHackathons.concat(this.joinedHackathons, this.pastHackathons);
        }
        callback(res)
      },
      (err) => {
        console.log("Error trying to join in service", err);
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
    for(let hack of this.joinedHackathons){
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

  submitProject(project, id, callback){
    console.log("We'll submit this", project);
    this._http.post(`/hackathons/${id}/addproject`, project).subscribe(
      (response) => {
        const res = response.json();
        console.log("We got our response", res)
        callback(res)
      },
      (err) => {
        console.log("Error trying to submit a project in service", err)
        callback({status: false})
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
      
      // hours = Math.floor(calcdeadline / 3600);
      // calcdeadline %= 3600;
      
      // if(hours > 1) toreturn += `${hours} hours `;
      // else if(hours == 1) toreturn += "1 hour "
      
      // minutes = Math.floor(calcdeadline / 60);
      // calcdeadline %= 60;
      
      // if(minutes > 1 || minutes == 0) toreturn += `${minutes} minutes `;
      // else if(minutes == 1) toreturn += "1 minute ";

      // seconds = calcdeadline;
      // if(seconds > 1 || seconds == 0) toreturn += `${seconds} seconds`;
      // else if(seconds == 1) toreturn += "1 second";

      // return toreturn;
    })
  }
}
