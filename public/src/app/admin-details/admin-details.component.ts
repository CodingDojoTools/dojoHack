import { Component, OnInit, OnDestroy, trigger, transition, style, animate } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-admin-details',
  templateUrl: './admin-details.component.html',
  styleUrls: ['./admin-details.component.css'],
  animations: [
    trigger(
      'errorAnimation',
      [
        transition(
          ':enter', [
            style({height: 0, opacity: 0}),
            animate('300ms', style({height: 18, opacity: 1}))
          ]
        ),
        transition(
          ':leave', [
            style({height: 18, opacity: 1}),
            animate('300ms', style({height: 0, opacity: 0})),
          ]
        )
      ]
    )
  ],
})
export class AdminDetailsComponent implements OnInit {
  
  hackathon: object;
  hackathonDone: boolean = false;
  hackathonId: number;
  judgable: boolean = true;
  paramSub: Subscription;
  presentable: boolean = true;
  readyToComplete: boolean = true;
  shutDown: boolean = false;
  submissions = [];
  winnerId: number = 0;

  



  constructor(private httpService: HttpService, private _router: Router, private _route: ActivatedRoute) { }

  ngOnInit() {
    this.paramSub = this._route.params.subscribe(param => {
      this.hackathonId = param.id;
      this.getSubmissions();
      this.getHackathon();
    
    })
  }

  getHackathon(){
    this.httpService.getObs(`/hackathons/any/${this.hackathonId}`).subscribe(
      data => {
        console.log("got the hackathon", data);
        this.hackathon = data["hackathon"];
        if(new Date(this.hackathon['deadline']) > new Date()){
          this.judgable = false;
          this.readyToComplete = false;
        }
        if(this.hackathon['winner']){
          this.hackathonDone = true;
          this.winnerId = this.hackathon['winner'];
        }
      },
      err => console.log("Got an error fetching a hackathon", err)
    )
  }

  getSubmissions(){
    this.httpService.getObs(`/hackathons/${this.hackathonId}/submissions`).subscribe(
      body => {
        console.log("Got body on admin details", body);
        this.submissions = body["submissions"];
        let submitted = false;
        for(let sub of this.submissions){
          if(sub.title){
            submitted = true;

            if(sub.judgedBy == 0) this.readyToComplete = false;
          }
        }
        if(!submitted) {
          this.judgable = false;
          this.presentable = false;
        }
        if (this.submissions.length == 0 || !submitted) {
          this.readyToComplete = false;
        }
        
        
      },
      err => {
        console.log("Got an error on admin details", err);
        
      }
    )
  }

  closeJudging(){
    if (confirm("Are you sure you want to close the judging? This will declare the winner of the hackathon!") == true) {
      this.httpService.getObs(`/hackathons/${this.hackathonId}/closeJudging`).subscribe(
        data => {
          console.log("got close judging", data);
          this.shutDown = true;
          this.winnerId = data['winnerId'];
          this.hackathonDone = true;
          this.judgable = false;
        },
        err => console.log("error closing", err)
        
      )
     
    }
    

  }

 

}
