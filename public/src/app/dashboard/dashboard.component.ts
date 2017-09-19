import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { Hackathon, Session } from '../models';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  joinedHackathons = [];
  postedHackathons = [];
  pastHackathons = [];
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
          this.pastHackathons = session.pastHackathons;
          this.postedHackathons = session.postedHackathons;
        }
      },
      err => console.log("Error with subscribing to behavior subject",err)
    )
  }

  moveToJoined(hackathon){
    console.log("We'll move this hackathon", hackathon);
    const index = this.postedHackathons.indexOf(hackathon);
    this.postedHackathons.splice(index, 1);
    this.joinedHackathons.push(hackathon);

  }

  ngOnDestroy(){
    this.sessionSub.unsubscribe();
  }

}
