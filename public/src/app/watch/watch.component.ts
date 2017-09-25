import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { Subscription } from 'rxjs/Subscription';
import { Hackathon, Project, Session} from '../models';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css']
})
export class WatchComponent implements OnInit {
  hackathon: Hackathon;
  hackathonId: number;
  paramSub: Subscription;
  session: Session;
  sessionSub: Subscription;
  submissions: Project[] = [];

  constructor(private httpService: HttpService, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    this.paramSub = this._route.params.subscribe(param => {
      this.hackathonId = param.id;
      this.getHackathon();
      // this.getSubmissions();
    })
  }

  getHackathon(){
    this.httpService.getObs(`hackathons/any/${this.hackathonId}`).subscribe(
      body => {
        this.hackathon = body['hackathon'];
        if(new Date(this.hackathon.deadline) > new Date()){
          this._router.navigate(['/dashboard'])
        }
        else {
         this.hackathon = body['hackathon'];
         this.getSubmissions();
          
        }
        
      },
      error => {
        console.log("Can't get a hackathon", error)
      }
    )
  }


  getSubmissions(){
    this.httpService.getObs(`/hackathons/${this.hackathonId}/submissions`).subscribe(
      body => {
        this.submissions = body['submissions'];
        // for(var i=0; i<this.submissions.length; i++){
        //   if(this.submissions[i].teamId == this.session.team.id){
        //     this.joined = true;
        //     let temp = this.submissions[i];
        //     this.submissions[i] = this.submissions[0];
        //     this.submissions[0] = temp;
        //     break;
        //   }
        // }
      },
      error => console.log("Can't seem to get submissions", error)
    )
  }

}
