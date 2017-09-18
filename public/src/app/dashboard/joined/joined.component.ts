import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { Router } from '@angular/router';
import { Hackathon } from '../../models';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-joined',
  templateUrl: './joined.component.html',
  styleUrls: ['./joined.component.css']
})
export class JoinedComponent implements OnInit {
  joinedHackathons = [];
  session: Subscription;
  

  constructor(private httpService: HttpService, private _router: Router) { 
    this.session = this.httpService.session.subscribe(
      session => {
        console.log("Receiving from behavior subject", session)
        this.session = session;
        if(session){
          this.joinedHackathons = session['joinedHackathons'];
        }
      },
      err => console.log("Error with subscribing to behavior subject",err)
    )
  }

  ngOnInit() {
    this.joinedHackathons = this.httpService.loggedSession.joinedHackathons;
    // this.httpService.fetchJoined((res)=>{
    //   if(res.status){
    //     this.joinedHackathons = res.hacks;
       
    //   }
    //   else {
    //     console.log("Could not get joined hackathons")
    //   }
    // })
    
  }
  submitEntry(hackId){
    console.log("Submitting for hack", hackId)
    this._router.navigate(['entry', hackId])
  }

 
  


  }

