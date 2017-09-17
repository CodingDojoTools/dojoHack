import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { Project, Hackathon } from '../models';
import { Subscription } from 'rxjs/Subscription';

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
  gitDanger: boolean;
  vidReq: boolean;
  vidDanger: boolean;
  invalidVid: boolean;
  descDanger: boolean;
  descReq: boolean;
  descLen: boolean;
  hackathonId: number;
  paramSub: Subscription;
  hackathon: Hackathon;


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
      gitUrl: ['', [Validators.required]],
      vidUrl: ['', [Validators.required]],
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
    this.gitDanger = this.gitReq;
    return newgit
  }
  get vidUrl(){
    let newvid = this.projForm.get('vidUrl');
    let vidErrors = newvid.errors ? newvid.errors : {};
    this.vidReq = vidErrors["required"] && newvid.touched;
    this.vidDanger = this.vidReq;
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
