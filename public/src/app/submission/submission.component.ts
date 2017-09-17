import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { Project } from '../models';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {

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

  constructor(private fb: FormBuilder, private httpService: HttpService, private _router: Router) { }

  ngOnInit() {
    this.projForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      gitUrl: ['', [Validators.required]],
      vidUrl: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(30)]]

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

}
