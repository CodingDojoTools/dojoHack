import { Component, OnDestroy, OnInit, trigger, transition, style, animate } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HttpService } from '../http.service';
import { CountdownService } from '../countdown.service';
import { Project, Hackathon, Session } from '../models';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

export function validGitUrl(control: FormControl) {
  const giturl = control.value;
  const gitRegex = /https:\/\/github\.com\/[\w\\-]+\/[\w\\-]+$/;
  return gitRegex.test(giturl) ? null : { match: true }
}
export function validYouTubeUrl(control: FormControl) {
  const yturl = control.value;
  const ytRegex = /https:\/\/youtu\.be\/[\w\-]+$/;
  return ytRegex.test(yturl) ? null : { match: true }
}

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css'],
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
export class SubmissionComponent implements OnInit, OnDestroy {
  allSubs: Subscription;
  canJoin: boolean;
  canSubmit: boolean;
  descDanger: boolean;
  descLen: boolean;
  descMsg: string;
  descReq: boolean;
  formChanges: Subscription;
  gitDanger: boolean;
  gitMatch: boolean;
  gitMsg: string;
  gitReq: boolean;
  hackathon: Hackathon;
  hackathonId: number;
  hackOver: boolean;
  invalidGit: boolean;
  invalidVid: boolean;
  newProj = new Project();
  notJoinedMessage: string;
  paramSub: Subscription;
  project: Project;
  projectId: number;
  projForm: FormGroup;
  session;
  sessionSub: Subscription;
  timerSub: Subscription;
  titleDanger: boolean;
  titleLen: boolean;
  titleMsg: string;
  titleReq: boolean;
  unfoundMessage: string;
  update: boolean;
  vidDanger: boolean;
  vidMatch: boolean;
  vidReq: boolean;
  ytMsg: string;

  constructor(private fb: FormBuilder, private httpService: HttpService, private _router: Router, private _route: ActivatedRoute, private count: CountdownService) {

  }

  ngOnInit() {

    this.projForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]],
      gitUrl: ['https://github.com/', [Validators.required, validGitUrl]],
      vidUrl: ['https://youtu.be/', [Validators.required, validYouTubeUrl]],
      description: ['', [Validators.required, Validators.minLength(30)]]
    })


    // this.projForm = this.fb.group({
    //   title: ['', []],
    //   gitUrl: ['https://github.com/', []],
    //   vidUrl: ['https://youtu.be/', []],
    //   description: ['', []]
    // })

    this.formChanges = this.projForm.valueChanges.subscribe(
      data => {
        this.titleMsg = null;
        this.gitMsg = null;
        this.ytMsg = null;
        this.descMsg = null;
      }
    )

    this.allSubs = Observable.combineLatest(
      [this.httpService.session, this._route.params.take(1)]).subscribe(
      results => {
        if (results[0] != null) {
          this.session = results[0];
          if (results[1].purpose == "submit") {
            this.update = false;
            this.hackathonId = results[1].id;
            this.getJoinedHackathon(results[1].id);
          }
          else if(results[1].purpose == "update") {
            this.update = true;
            this.projectId = results[1].id;
            this.getProject(results[1].id);

          }
          else {
            this._router.navigate(['/dashboard']);
          }
        }
      },
      err => console.log(err)
    )

   
  }

  getProject(id) {
    this.httpService.getObs(`/projects/${id}`).subscribe(
      body => {
        this.project = body['project'][0];
       
        this.projForm.setValue({
          title: this.project.title,
          gitUrl: this.project.gitUrl,
          vidUrl: this.project.vidUrl,
          description: this.project.description

        });
        this.getJoinedHackathon(this.project.hackathonId);
      },
      error => console.log(error)
    )
  }

  getJoinedHackathon(id) {
    
    this.httpService.getObs(`/hackathons/joined/${id}`).subscribe(
      body => {
       
        this.hackathon = body['hackathon'];
      
        this.count.getTimeLeft(this.hackathon);
        if(this.hackathon['secondsLeft']){
          this.timerSub = this.hackathon['secondsLeft'].subscribe(
            data => {
            
              if(data < 1){
                this.hackOver = true;
              }
              else {
                this.hackOver = false;
              }
            }
          )
        }
        this.canSubmit = true;
        this.canJoin = false;
        this.unfoundMessage = null;
        this.notJoinedMessage = null;
      },
      err => {
        console.log(err);

        this.getUnjoinedHackathon(id);
        this.canSubmit = false;

      }
    )
  }

  getUnjoinedHackathon(id) {
   
    this.httpService.getObs(`/hackathons/${this.hackathonId}`).subscribe(
      body => {
        
        this.notJoinedMessage = "You haven't joined this hackathon yet!";
        this.hackathon = body['hackathon'];
        this.canJoin = true;
      },
      err => {
       
        if(err.message){
          this.unfoundMessage = err.message.over ? err.message.over : err.message.dne ? err.message.dne : null
        
        }
       
        else {
          this.unfoundMessage = "Nothing to see. Let's go back to the dashboard."

        }
      }
    )
  }

  hackEntry() {
    const model = this.projForm.value;
    if (this.projForm.status == "VALID") {
      this.newProj.title = model.title;
      this.newProj.gitUrl = model.gitUrl;
      this.newProj.vidUrl = model.vidUrl;
      this.newProj.description = model.description;

      this.httpService.postObs(
        `/hackathons/${this.hackathon.id}/addproject`, this.newProj
      ).subscribe(
        body => {
          this.count.submissionFlashMessage = "You successfully submitted your project!";
          this._router.navigate(['/details', this.hackathon.id]);
        },
        err => {
          
          if(err.message){
            if(err.message.title) this.titleMsg = err.message.title;
            if(err.message.git) this.gitMsg = err.message.git;
            if(err.message.yt) this.ytMsg = err.message.yt;
            if(err.message.desc) this.descMsg = err.message.desc;
          }
        }
      )
    }
  }

  cancel() {
    let previousUrl = this.count.previousUrl ? this.count.previousUrl : "/dashboard";
      this._router.navigate([previousUrl]);
  }

  get title() {
    let newTitle = this.projForm.get('title');
    let titleErrors = newTitle.errors ? newTitle.errors : {};
    this.titleLen = (titleErrors["minlength"] && newTitle.touched) || titleErrors["maxlength"];
    this.titleReq = titleErrors["required"] && newTitle.touched
    this.titleDanger = this.titleLen || this.titleReq
    return newTitle

  }

  get gitUrl() {
    let newgit = this.projForm.get('gitUrl');
    let gitErrors = newgit.errors ? newgit.errors : {};

    this.gitReq = gitErrors["required"] && newgit.touched;
    this.gitMatch = gitErrors["match"] && newgit.touched;
    this.gitDanger = this.gitReq || this.gitMatch;
    return newgit
  }
  get vidUrl() {
    let newvid = this.projForm.get('vidUrl');
    let vidErrors = newvid.errors ? newvid.errors : {};
    this.vidReq = vidErrors["required"] && newvid.touched;
    this.vidMatch = vidErrors["match"] && newvid.touched;
    this.vidDanger = this.vidReq || this.vidMatch;
    return newvid;
  }
  get description() {
    let newdesc = this.projForm.get('description');
    let descErrors = newdesc.errors ? newdesc.errors : {};
    this.descReq = descErrors["required"] && newdesc.touched;
    this.descLen = descErrors["minlength"] && newdesc.touched;
    this.descDanger = this.descReq || this.descLen;
    return newdesc;
  }

  ngOnDestroy() {
   
    this.allSubs.unsubscribe();
    if(this.timerSub){

      this.timerSub.unsubscribe();
    }
    this.formChanges.unsubscribe();
  }

}
