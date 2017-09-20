import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs/Observable';
import { CountdownService } from '../countdown.service';
import { Subscription } from 'rxjs/Subscription';
import { Hackathon, Project, Session } from '../models';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {

  paramSub: Subscription;
  hackathonId: number;
  hackathon: Hackathon;
  submissions = [];
  submissionMessage: string;
  sessionSub: Subscription;
  session: Session;


  constructor(private httpService: HttpService, private _router: Router, private _route: ActivatedRoute, private count: CountdownService) { }

  ngOnInit() {
    this.paramSub = this._route.params.subscribe(param => {
      this.hackathonId = param.id;
      this.getHackathon();
      this.getSubmissions();
    })

    this.sessionSub = this.httpService.session.subscribe(
      session => {
        console.log("Receiving from behavior subject", session)
        this.session = session;
      },
      err => console.log("Error with subscribing to behavior subject",err)
    )
  }
  ngOnDestroy(){
    this.paramSub.unsubscribe();
  }

  getSubmissions(){
    this.httpService.getObs(`/hackathons/${this.hackathonId}/submissions`).subscribe(
      body => {
        this.submissions = body['submissions'];
        for(var i=0; i<this.submissions.length; i++){
          if(this.submissions[i].teamId == this.session.loggedInId){
            let temp = this.submissions[i];
            this.submissions[i] = this.submissions[0];
            this.submissions[0] = temp;
            break;
          }
        }
      },
      error => console.log("Can't seem to get submissions", error)
    )
  }

  getHackathon(){
    this.httpService.getObs(`hackathons/${this.hackathonId}`).subscribe(
      body => {
        this.hackathon = body['hackathon'][0];
        this.count.getTimeLeft(this.hackathon);
        
      },
      error => console.log("Can get a hackathon", error)
    )
  }


}
