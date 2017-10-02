import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { Subscription } from 'rxjs/Subscription';
import { NgxCarousel } from 'ngx-carousel';
import { Hackathon, Project, Session, Carousel} from '../models';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { CountdownService } from '../countdown.service';

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
export class WatchComponent implements OnInit, OnDestroy {
  hackathon: Hackathon;
  hackathonId: number;
  noneMessage: string;
  paramSub: Subscription;
  session: Session;
  sessionSub: Subscription;
  projects: Project[] = [];
 
  public carouselBannerItems: Array<any>;
  public carouselBanner;

  constructor(private httpService: HttpService, private _route: ActivatedRoute, private _router: Router, private count: CountdownService) { }

  ngOnInit() {

    this.sessionSub = this.httpService.session.subscribe(
      session => {
       
        this.session = session;
      },
      err => console.log(err)
    )

    this.paramSub = this._route.params.subscribe(param => {
      this.hackathonId = param.id;
      this.getHackathon();
      
     
    })
    



       this.carouselBannerItems = [0, 1, 2, 3, 4];
       
          this.carouselBanner = {
            grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
            slide: 1,
            speed: 400,
            point: false,
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
          if(this.count.previousUrl){
            this._router.navigate([this.count.previousUrl]);
          }
          else if(this.session.admin){
            this._router.navigate(['/dashboard', 'admin'])
          }
          else {

            this._router.navigate(['/dashboard'])
          }
        }
        else {
         this.hackathon = body['hackathon'];
         this.getProjects();
          
        }
        
      },
      error => {
        console.log(error)
      }
    )
  }


  getProjects(){
    this.httpService.getObs(`/hackathons/${this.hackathonId}/allprojects`).subscribe(
      body => {
        this.projects = body['projects'];
     
        if(this.projects.length < 1){
          this.noneMessage = "Oops, no one submitted to this hackathon!"
        }
        for(let project of this.projects){
          project['safeurl'] = project.vidUrl.replace("youtu.be", "www.youtube.com/embed")+"?rel=0&enablejsapi=1";
         
        }
      
      },
      error => console.log(error)
    )
  }

  goback(){
    if(this.count.previousUrl) this._router.navigate([this.count.previousUrl]);
    else if(this.session.admin) this._router.navigate(['/dashboard', 'admin']);
    else this._router.navigate(['/dashboard'])
  }
  ngOnDestroy(){
    this.paramSub.unsubscribe();
    this.sessionSub.unsubscribe();
  }

}
