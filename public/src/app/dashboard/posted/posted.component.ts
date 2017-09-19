import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { Hackathon, Session } from '../../models';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-posted',
  templateUrl: './posted.component.html',
  styleUrls: ['./posted.component.css']
})
export class PostedComponent implements OnInit {
  postedHackathons: Hackathon[] = []
  sessionSub: Subscription;
  session: Session;

  constructor(private httpService: HttpService) { 
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

  ngOnInit() {
    this.postedHackathons = this.httpService.loggedSession.postedHackathons;
    
  }
  joinHackathon(hackId){
    console.log("we're joining this hackathon", hackId);
    this.httpService.getObs(`/hackathons/${hackId}/join`).subscribe(
      body => {
        console.log("We joined!", body);
        const joined = this.session.postedHackathons.splice(hackId, 1)[0];
        this.session.joinedHackathons.push(joined);
        this.httpService.updateSession(this.session);
        


      },
      err => console.log("We have an error!", err)
    )
      
  }
}
