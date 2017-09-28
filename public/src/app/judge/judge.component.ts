import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { Subscription } from 'rxjs/Subscription';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-judge',
  templateUrl: './judge.component.html',
  styleUrls: ['./judge.component.css']
})
export class JudgeComponent implements OnInit {
  
  hackathon: object;
  hackathonId: number;
  paramSub: Subscription;
  projects = [];
  judgeForm: FormGroup;
  scores = [];
  
  
  constructor(private fb: FormBuilder, private httpService: HttpService, private _router: Router, private _route: ActivatedRoute) {}

  ngOnInit() {
    this.paramSub = this._route.params.subscribe(param => {
      this.hackathonId = param.id;
      this.getProjects();
      this.getHackathon();
    })

    this.judgeForm = this.fb.group({
      scores: this.fb.array([])
    })
  }
  initTeam(project){
    return this.fb.group({
      teamName: [project.teamName+"", []],
      projectId: [project.id+"", []],
      projectTitle: [project.title+"", []],
      ui: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      presentation: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      idea: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      implementation:  ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      extra:  ['0', [Validators.required, Validators.min(0), Validators.max(5)]],
      comment:  ['', []],
    })
  }

  generateTeamsForm(){
    var control = <FormArray>this.judgeForm.controls['scores'];
    for(let project of this.projects){
      console.log("adding a control", project);
      
      control.push(this.initTeam(project));
    }
   
  }

  submitScores(){
    console.log("sumbitting scores");
    const model = this.judgeForm.value;
    if(this.judgeForm.status == "VALID"){
      console.log(model);
      // this.httpService.postObs('/admin/score')
    }
    
  }

  getProjects(){
    this.httpService.getObs(`/hackathons/${this.hackathonId}/allprojects`).subscribe(
      body => {
        console.log("Got the body on admin details", body)
        this.projects = body["projects"]
        this.generateTeamsForm();
      },
      err => {
        console.log("Got the error on admin details", err)
      }
    ) 
  }

  getHackathon(){
    this.httpService.getObs(`/hackathons/any/${this.hackathonId}`).subscribe(
      data => {
        console.log("got the hackathon", data);
        this.hackathon = data["hackathon"];
      },
      err => console.log("Got an error fetching a hackathon", err)
    )
  }
}
