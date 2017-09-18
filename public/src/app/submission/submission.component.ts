import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { Project, Hackathon } from '../models';
import { Subscription } from 'rxjs/Subscription';

export function validGitUrl(control: FormControl){
  const giturl = control.value;
  const gitRegex = /https:\/\/github\.com\/[\w\\-]+\/[\w\\-]+$/;
  return gitRegex.test(giturl) ? null : {match: true}
}
export function validYouTubeUrl(control: FormControl){
  const yturl = control.value;
  const ytRegex = /https:\/\/youtu\.be\/\w+$/;
  return ytRegex.test(yturl) ? null : {match: true}
}

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit, OnDestroy {

  projForm: FormGroup;
  titleLen: boolean;
  titleReq: boolean;
  titleDanger: boolean;
  invalidGit: boolean;
  gitReq: boolean;
  gitMatch: boolean;
  gitDanger: boolean;
  vidReq: boolean;
  vidMatch: boolean;
  vidDanger: boolean;
  invalidVid: boolean;
  descDanger: boolean;
  descReq: boolean;
  descLen: boolean;
  hackathonId: number;
  paramSub: Subscription;
  hackathon: Hackathon;
  newProj = new Project();



  constructor(private fb: FormBuilder, private httpService: HttpService, private _router: Router, private _route: ActivatedRoute) {
    this.paramSub = this._route.params.subscribe((param)=>{
      this.hackathonId = param.id;
      console.log("the parameter is", param.id)
      this.getHackathon(param.id);
    })
   }

  ngOnInit() {
    this.projForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      gitUrl: ['https://github.com/', [Validators.required, validGitUrl]],
      vidUrl: ['https://youtu.be/', [Validators.required, validYouTubeUrl]],
      description: ['', [Validators.required, Validators.minLength(30)]]
    })
  }

  getHackathon(id){
    console.log("asking the service for", id)
    this.httpService.getOneJoinedHackathon(id, (res) => {
      if(res.status){
       this.hackathon = res.hackathon;
       console.log("got the hackathon", this.hackathon)
      }
      else {
        console.log("This isn't a hackathon we can submit to")
      }
    })
  }

  hackEntry(){
    const model = this.projForm.value;
    if(this.projForm.status=="VALID"){
      this.newProj.title = model.title;
      this.newProj.gitUrl = model.gitUrl;
      this.newProj.vidUrl = model.vidUrl;
      this.newProj.description = model.description;
      
      this.httpService.postObs(
        `/hackathons/${this.hackathonId}/addproject`, this.newProj
      ).subscribe(
        body => {
          this.httpService.submissionFlashMessage = "You successfully submitted your project!";
          this._router.navigate(['/details', this.hackathonId]);
        },
        err => console.log("handle the error on failed submission")
      )
    }
  }

  cancel(){
    console.log("canceling the submission")
    this.projForm.reset();
  }
  
  get title(){
    let newTitle = this.projForm.get('title');
    let titleErrors = newTitle.errors ? newTitle.errors : {};
    this.titleLen = (titleErrors["minlength"] && newTitle.touched) || titleErrors["maxlength"];
    this.titleReq = titleErrors["required"] && newTitle.touched
    this.titleDanger = this.titleLen || this.titleReq
    return newTitle

  }

  get gitUrl(){
    let newgit = this.projForm.get('gitUrl');
    let gitErrors = newgit.errors ? newgit.errors : {};
    
    this.gitReq = gitErrors["required"] && newgit.touched;
    this.gitMatch = gitErrors["match"] && newgit.touched;
    this.gitDanger = this.gitReq || this.gitMatch;
    return newgit
  }
  get vidUrl(){
    let newvid = this.projForm.get('vidUrl');
    let vidErrors = newvid.errors ? newvid.errors : {};
    this.vidReq = vidErrors["required"] && newvid.touched;
    this.vidMatch = vidErrors["match"] && newvid.touched;
    this.vidDanger = this.vidReq || this.vidMatch;
    return newvid;
  }
  get description(){
    let newdesc = this.projForm.get('description');
    let descErrors = newdesc.errors ? newdesc.errors : {};
    this.descReq = descErrors["required"] && newdesc.touched;
    this.descLen = descErrors["minlength"] && newdesc.touched;
    this.descDanger = this.descReq || this.descLen;
    return newdesc;
  }

  ngOnDestroy(){
    this.paramSub.unsubscribe();
  }

}
