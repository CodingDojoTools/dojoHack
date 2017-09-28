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

  paramSub: Subscription;
  projectId: number;

  constructor(private httpService: HttpService, private _router: Router, private _route: ActivatedRoute) { }

  ngOnInit() {
    this.paramSub = this._route.params.subscribe(param => {
      this.projectId = param.id;
      // this.getProject();
    
    })
  }
  getProject(){
    this.httpService.getObs(`/projects/${this.projectId}`).subscribe(
      data => console.log("got the data for one project", data),
      err => console.log("got an error fetching one project", err)
    )
  }

}
