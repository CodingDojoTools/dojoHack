import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { Project, Hackathon } from '../models';
import { Subscription } from 'rxjs/Subscription';

// export function validGitUrl(group: FormGroup){
//   const model = group.value;
//   const giturl = model.gitUrl;
//   const gitRegex = new RegExp('((git|ssh|http(s)?)|(git@[\w\.]+))(:(//)?)([\w\.@\:/\-~]+)(\.git)?(/)?');
//   console.log("testing the git regex", gitRegex.test(giturl))
//   return gitRegex.test(giturl) ? null : {invalid: true}
// }

export function validGitUrl(control: FormControl){
  const giturl = control.value;
  const gitRegex = new RegExp('((git|ssh|http(s)?)|(git@[\w\.]+))(:(//)?)([\w\.@\:/\-~]+)(\.git)?(/)?');
  console.log("testing the git regex", gitRegex.test(giturl))
  return gitRegex.test(giturl) ? null : {match: true}
}
export function validYouTubeUrl(control: FormControl){
  const yturl = control.value;
  const ytRegex = new RegExp('(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*');
  return ytRegex.test(yturl) ? null: {match: true}
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
      gitUrl: ['', [Validators.required, validGitUrl]],
      vidUrl: ['', [Validators.required, validYouTubeUrl]],
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
      
      this.httpService.submitProject(this.newProj, this.hackathonId, (res)=>{
        if(res.status){
          console.log("We added our project!", res.projectId)
        }
        else {
          console.log("We'll have to figure out how to display error messages")
        }
      })


    }

    console.log("submitting an entry")
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
