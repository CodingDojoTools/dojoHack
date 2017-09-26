import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { Subscription } from 'rxjs/Subscription';
import { NgxCarousel } from 'ngx-carousel';
import { Hackathon, Project, Session, Carousel} from '../models';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css'],
})
export class WatchComponent implements OnInit {
  hackathon: Hackathon;
  hackathonId: number;
  paramSub: Subscription;
  session: Session;
  sessionSub: Subscription;
  projects: Project[] = [];
  public carouselTileItems: Array<any>;
  public carouselTile;

  constructor(private httpService: HttpService, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    this.paramSub = this._route.params.subscribe(param => {
      this.hackathonId = param.id;
      this.getHackathon();
      
      // this.getSubmissions();
    })
    this.carouselTileItems = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    
    this.carouselTile = {
         grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
         slide: 1,
         speed: 400,
         animation: 'lazy',
         point: true,
         load: 2,
         touch: true,
         custom: 'tile',
         dynamicLength: true
       }
  }


  public carouselTileLoad(evt: any) {
    
       const len = this.carouselTileItems.length
       if (len <= 30) {
         for (let i = len; i < len + 10; i++) {
           this.carouselTileItems.push(i);
         }
       }
    
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
         this.getProjects();
          
        }
        
      },
      error => {
        console.log("Can't get a hackathon", error)
      }
    )
  }


  getProjects(){
    this.httpService.getObs(`/hackathons/${this.hackathonId}/allprojects`).subscribe(
      body => {
        this.projects = body['projects'];
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
