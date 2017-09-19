import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from '../../http.service';
import { Hackathon, Session } from '../../models';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-past',
  templateUrl: './past.component.html',
  styleUrls: ['./past.component.css']
})
export class PastComponent implements OnInit, OnDestroy {
  pastHackathons: Hackathon[] = []
  sessionSub: Subscription;
  session: Session;
  

  constructor(private httpService: HttpService) { 
    
  }

  ngOnInit() {
    this.sessionSub = this.httpService.session.subscribe(
      session => {
        console.log("Past component Receiving from behavior subject", session)
        this.session = session;
        if(session){
          this.pastHackathons = session.pastHackathons;
        }
      },
      err => console.log("Error with subscribing to behavior subject",err)
    )
    
  }
  ngOnDestroy(){
    this.sessionSub.unsubscribe();
  }


}
