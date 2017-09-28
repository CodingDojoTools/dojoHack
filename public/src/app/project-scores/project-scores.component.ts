import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-project-scores',
  templateUrl: './project-scores.component.html',
  styleUrls: ['./project-scores.component.css']
})
export class ProjectScoresComponent implements OnInit {

  hackathon: object;
  members = [];
  paramSub: Subscription;
  project: object;
  projectId: number;
  scores = [];

  constructor(private httpService: HttpService, private _router: Router, private _route: ActivatedRoute) { }

  ngOnInit() {
    this.paramSub = this._route.params.subscribe(param => {
      this.projectId = param.id;
      this.getProject();
    
    })
  }
  getProject(){
    this.httpService.getObs(`/projects/${this.projectId}`).subscribe(
      data => {
        this.project = data['project'][0];
        this.getHackathon(this.project['hackathonId']);
        this.getMembers();
        this.getScores();
      },
      err => console.log("got an error fetching one project", err)
    )
  }

  getHackathon(id){
    this.httpService.getObs(`/hackathons/any/${id}`).subscribe(
      data => {
        this.hackathon = data['hackathon']
      },
      err => {
        console.log("got an error fetching hackathon", err);
      }
    )
  }

  getMembers(){
    this.httpService.getObs(`/teams/${this.project['teamId']}/members`).subscribe(
      data => {
        
        this.members = data["members"];
      },
      err => {
        console.log("got an error with members", err)
      }
    )
  }

  getScores(){
    this.httpService.getObs(`/projects/${this.projectId}/scores`).subscribe(
      data => {
        
        this.scores = data["scores"];
      },
      err => console.log("got an error getting scores", err)
    )
  }

}
