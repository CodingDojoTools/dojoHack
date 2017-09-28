import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-admin-details',
  templateUrl: './admin-details.component.html',
  styleUrls: ['./admin-details.component.css']
})
export class AdminDetailsComponent implements OnInit {
  
  hackathon: object;
  hackathonId: number;
  paramSub: Subscription;
  
  submissions = [];



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
      },
      err => console.log("Got an error fetching a hackathon", err)
    )
  }

  getSubmissions(){
    this.httpService.getObs(`/hackathons/${this.hackathonId}/submissions`).subscribe(
      body => {
        console.log("Got body on admin details", body);
        this.submissions = body["submissions"];
      },
      err => {
        console.log("Got an error on admin details", err);
        
      }
    )
  }

 

}
