import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { CountdownService } from '../countdown.service';
import { HttpService } from '../http.service';
import { Team, Member, Session } from '../models';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  formSubs: Subscription;
  location;
  locations = [];
  loggedTeam = new Team();
  members: Member[] = [];
  proForm: FormGroup;
  session: Session;
  sessionSub: Subscription;

  constructor(private fb: FormBuilder, private httpService: HttpService, private _router: Router, private count: CountdownService) { }

  ngOnInit() {
    this.sessionSub = this.httpService.session.subscribe(
      session => {
        this.session = session;
      },
      err => console.log("Error geting session", err)
    )
    
    this.proForm = this.fb.group({
      teamName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]],
      location: [''],
      
      members: this.fb.array([])
    })
    this.formSubs = Observable.combineLatest([this.httpService.getObs('/locations'), this.httpService.getObs('/teams/members')]).subscribe(
      results => {
        this.locations = results[0]['locations'];
        this.getLoggedLocation();
        this.members = results[1]['members'];
        this.generateMembersForm();
      },
      err => console.log("Got form subs error", err)
    )
    
  }

  ngOnDestroy(){
    this.formSubs.unsubscribe();
    this.sessionSub.unsubscribe();
  }

  generateMembersForm(){
    
    
    var control = <FormArray>this.proForm.controls['members'];
    console.log("control", control)
    while(control.controls.length > 0){
      control.controls.pop();
    }
    for(let member of this.members){

      control.push(this.initMember(member));
    }
    this.proForm.patchValue({
      teamName: this.session.team.name,
      location: this.location.id,
     
    })
  }

  getLoggedLocation(){
    for(let loc of this.locations){
      if(loc.id == this.session.team.location){
        this.location = loc;
        break;
      }
    }
  }

  initMember(member){
    return this.fb.group({
      firstName: [member.firstName, [Validators.required, Validators.minLength(3)]],
      lastName: [member.lastName, [Validators.required, Validators.minLength(2)]]
    })
  }

  getMembers(){
    this.httpService.getObs('/teams/members').subscribe(
      data => {
        this.members = data['members'];
        
        this.generateMembersForm();
      },
      err => console.log("getting err from trying to fetch members", err)
    )
  }

  cancel(){
    if(this.proForm.pristine){
      this._router.navigate(['/dashboard'])
    }
    else {
      this.proForm.reset();
      this.generateMembersForm();
    }
  }
  updateTeam(){
    const model = this.proForm.value;
    if(this.proForm.status == "VALID"){
      for(var i=0; i<model.members.length; i++){
        model.members[i]['id'] = this.members[i]['id']
      }
      this.httpService.postObs('/teams/update', model).subscribe(
        data => {

          this.httpService.postObs('/teams/updateMembers', model).subscribe(
            data => {
              this.count.updateTeamMsg = "Your team was successfully updated!";
              this.session.team.name = model.teamName;
              this.httpService.updateSession(this.session);
              this._router.navigate(['/dashboard'])
            },
            err => {
              console.log("Error from updating members", err);
              
            }
          )
        },
        err => console.log("Got error from update", err)
        
        
      )
      
      console.log("valid", model);
    }
    else {
      console.log("Not valid", model);
      
    }
  }

}
