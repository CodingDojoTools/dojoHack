import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { Subscription } from 'rxjs/Subscription';
import { NgxCarousel } from 'ngx-carousel';
import { Hackathon, Project, Session, Carousel} from '../models';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
} 

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
 
  public carouselBannerItems: Array<any>;
  public carouselBanner;

  constructor(private httpService: HttpService, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    this.paramSub = this._route.params.subscribe(param => {
      this.hackathonId = param.id;
      this.getHackathon();
      
      // this.getSubmissions();
    })
    



       this.carouselBannerItems = [0, 1, 2, 3, 4];
       
          this.carouselBanner = {
            grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
            slide: 1,
            speed: 400,
            point: true,
            load: 2,
            loop: true,
            custom: 'banner',
            touch: true,
            dynamicLength: false
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
        for(let project of this.projects){
          project['safeurl'] = project.vidUrl.replace("watch?v=", "embed/");
        }
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
