import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../../http.service';
import { Hackathon, Session } from '../../models';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-posted',
  templateUrl: './posted.component.html',
  styleUrls: ['./posted.component.css']
})
export class PostedComponent implements OnInit, OnDestroy {
  postedHackathons: Hackathon[] = []
  sessionSub: Subscription;
  session: Session;

  constructor(private httpService: HttpService) { 
    
  }

  ngOnInit() {
  this.sessionSub = this.httpService.session.subscribe(
    session => {
      console.log("Receiving from behavior subject", session)
      this.session = session;
      if(session){
        this.postedHackathons = session.postedHackathons;
      }
    },
    err => console.log("Error with subscribing to behavior subject",err)
  )
  }
  joinHackathon(hack){
    
    this.httpService.getObs(`/hackathons/${hack.id}/join`).subscribe(
      body => {
        console.log("We joined!", body);
        const index = this.session.postedHackathons.indexOf(hack)
        this.session.postedHackathons.splice(index, 1)[0];
        this.session.joinedHackathons.push(hack);
        this.httpService.getTimeLeft(hack);
        this.httpService.updateSession(this.session);
      },
      err => console.log("We have an error trying to join a hackathon!", err)
    )
      
  }
  ngOnDestroy(){
    this.sessionSub.unsubscribe();
  }
}
