import { Component, OnInit, OnDestroy, trigger, transition, style, animate } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { Hackathon } from '../models';
import { CountdownService } from '../countdown.service';


export function deadlineFuture(control: FormControl){
  const deadline = new Date(control.value);
  return deadline > new Date() ? null : { future: true }
}

@Component({
  selector: 'app-create-hack',
  templateUrl: './create-hack.component.html',
  styleUrls: ['./create-hack.component.css'],
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
export class CreateHackComponent implements OnInit {

  constructor(private fb: FormBuilder, private httpService: HttpService, private _router: Router, private count: CountdownService) { }

  dateDanger: boolean;
  dateFuture: boolean;
  hackForm: FormGroup;
  nameDanger: boolean;
  newHack: Hackathon = new Hackathon();
  themeDanger: boolean;


  ngOnInit() {
    this.hackForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(32)]],
      date: ['', [Validators.required, deadlineFuture]],
      theme: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32)]],
      info: ['',]
    })
  }

  create(){
    
    const model = this.hackForm.value;
   
    if(this.hackForm.status == "VALID"){
      this.newHack.name = model.name;
      this.newHack.deadline = new Date(model.date);

      this.newHack.theme = model.theme;
      this.newHack.info = model.info;
   
      this.httpService.postObs('/admin/hackathons', this.newHack).subscribe(
        data => {
         
          this._router.navigate(['/dashboard', 'admin'])
        },
        err => console.log("Got error while making new hack", err)
      )
    }
  }

  get name() {
    let hackName = this.hackForm.get('name');
    let nameError = hackName.errors ? hackName.errors : {};
    this.nameDanger = ((nameError["required"] || nameError["minlength"]) && hackName.touched) || nameError["maxlength"];
    return hackName;
  }

  get theme(){
    let hackTheme = this.hackForm.get('theme');
    let themeError = hackTheme.errors ? hackTheme.errors : {};
    this.themeDanger = ((themeError["required"] || themeError["minlength"]) && hackTheme.touched) || themeError["maxlength"];
    return hackTheme;
  }

  get date(){
    let date = this.hackForm.get('date');
    let dateError = date.errors ? date.errors : {};
    this.dateFuture = dateError["future"] && date.touched
    this.dateDanger = (dateError["required"] || dateError["future"]) && date.touched;
    
    return date;
  }





}
