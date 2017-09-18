import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { Subscription } from 'rxjs/Subscription';
import { Hackathon, Project } from '../models';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {

  paramSub: Subscription;
  hackathonId: number;
  hackathon: Hackathon;
  submissions: Project[] = [];
  submissionMessage: string;

  constructor(private httpService: HttpService, private _router: Router, private _route: ActivatedRoute) { 
    this.paramSub = this._route.params.subscribe((param)=>{
      this.hackathonId = param.id;
      console.log("the parameter is", param.id)
      this.getHackathon(param.id);
    })
  }

  getHackathon(id){
    console.log("asking the service for", id)
    this.httpService.getOneHackathon(id, (res) => {
      if(res.status){
       this.hackathon = res.hackathon;
       console.log("got the hackathon", this.hackathon)
      }
      else {
        console.log("This hackathon doesn't exist")
      }
    })
  }

  ngOnInit() {
    // get submission to this hackathon
    this.getSubmissions();
    this.submissionMessage = this.httpService.submissionFlashMessage;
  }
  ngOnDestroy(){
    this.httpService.submissionFlashMessage = null;
  }

  getSubmissions(){
    this.httpService.getHackathonSubmissions(this.hackathonId, (res)=>{
      if(res.status){
        this.submissions = res.submissions;
        console.log("We have the submissions", this.submissions)
      }
      else {
        console.log("Handle not being able to get the submissions")
      }
    })
  }


}
