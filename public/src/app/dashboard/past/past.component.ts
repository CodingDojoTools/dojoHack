import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { Hackathon } from '../../models';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-past',
  templateUrl: './past.component.html',
  styleUrls: ['./past.component.css']
})
export class PastComponent implements OnInit {
  pastHackathons: Hackathon[] = []
  session: Subscription;
  

  constructor(private httpService: HttpService) { 
    this.session = this.httpService.session.subscribe(
      session => {
        console.log("Receiving from behavior subject", session)
        this.session = session;
        if(session){
          this.pastHackathons = session['pastHackathons'];
        }
      },
      err => console.log("Error with subscribing to behavior subject",err)
    )
  }

  ngOnInit() {
    // this.httpService.fetchPast((res) => {
    //   if(res.status){
    //     console.log("we got past hackahtons to post!")
    //     this.pastHackathons = res.hacks;
    //     console.log(this.pastHackathons)
    //   }
    //   else {
    //     console.log("We don't appear to have any luck.")
    //   }
    // })
    this.pastHackathons = this.httpService.loggedSession.pastHackathons;
  }


}
