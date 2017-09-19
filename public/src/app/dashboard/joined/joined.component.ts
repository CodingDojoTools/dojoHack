import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../../http.service';
import { Router } from '@angular/router';
import { Hackathon, Session } from '../../models';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-joined',
  templateUrl: './joined.component.html',
  styleUrls: ['./joined.component.css']
})
export class JoinedComponent implements OnInit, OnDestroy {
  joinedHackathons = [];
  sessionSub: Subscription;
  session: Session;
  

  constructor(private httpService: HttpService, private _router: Router) { }

  ngOnInit() {
    this.sessionSub = this.httpService.session.subscribe(
      session => {
        console.log("Receiving from behavior subject", session)
        this.session = session;
        if(session){
          this.joinedHackathons = session.joinedHackathons;
        }
      },
      err => console.log("Error with subscribing to behavior subject",err)
    )
  }

  submitEntry(hackId){
    console.log("Submitting for hack", hackId)
    this._router.navigate(['entry', hackId])
  }

  ngOnDestroy(){
    this.sessionSub.unsubscribe();
  }

 
  


  }

